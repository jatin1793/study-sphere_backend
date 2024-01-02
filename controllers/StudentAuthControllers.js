const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const cloudinary = require("cloudinary").v2
const Student = require('../models/studentModel.js');
const Course = require('../models/courseModel.js')
const Instructor = require('../models/instructorModel.js')
require("dotenv").config();

var salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

exports.StudentRegister = async (req, res) => {
    const { phone, email, name, password, institution, qualification, course } = req.body;
    try {
        const ifexists = await Student.findOne({ email });
        if (ifexists) {
            res.json({ alreadyExists: true })
        }
        else {
            const user = await Student.create({
                token: "", phone, email, name, password: bcrypt.hashSync(password, salt), institution, qualification, course
            })
            const student_token = jwt.sign({ userId: user._id }, secret);
            user.token = student_token;
            await user.save();
            res.status(201).json({ student_token, user })
        }
    }
    catch (error) {
        console.log(error);
    }
};

exports.StudentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Student.findOne({ email });

        if (!user) {
            res.json({ StudentExists: false, passCheck: false });
        }
        else {
            const passCheck = bcrypt.compareSync(password, user.password, { expiresIn: process.env.JWT_TOKEN_EXPIRE })
            if (passCheck) {
                const student_token = jwt.sign({ userId: user._id }, secret);
                Student.findOneAndUpdate({ email: user.email }, { student_token })
                    .then(() => { })
                    .catch((err) => { console.log(err) })

                res.json({ StudentExists: true, passCheck: true, student_token, user });

            } else {
                res.json({ StudentExists: true, passCheck: false });
            }
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.StudentLogout = async (req, res) => {
    res.clearCookie("student_token");
    res.json({ message: "Successfully signout!" });
};

exports.StudentDetails = async (req, res) => {
    try {
        var student = await Student.findById(req.user)
            .populate('joinedcourses')
            .populate({
                path: 'likedvideos', 
                populate: [
                    { path: 'videoCourse' }, { path: 'instructor' }
                ]
            })
        res.json(student)
    }
    catch (err) {
        res.json(err)
    }
}

exports.CheckIfEnrolled = async (req, res) => {
    try {
        const { courseid } = req.params;
        const course = await Course.findById(courseid);
        if (!course.enrolledStudents.includes(req.user)) {
            res.json({ isEnrolled: true })
        }
        else {
            res.json({ isEnrolled: false })
        }
    }
    catch (err) {
        res.json(err)
    }
}

exports.JoinCourse = async (req, res) => {
    try {
        const { courseid } = req.params;
        const course = await Course.findById(courseid);
        const student = await Student.findById(req.user);

        if (!course.enrolledStudents.includes(req.user)) {
            course.enrolledStudents.push(req.user)
            const student = await Student.findById(req.user);
            student.joinedcourses.push(courseid)
            await student.save()
            await course.save()
            res.json({ isEnrolled: false })
        }
        else {
            const courseIndex = student.joinedcourses.indexOf(courseid);
            const studentIndex = course.enrolledStudents.indexOf(req.user);
            if (courseIndex !== -1 && studentIndex !== -1) {
                student.joinedcourses.splice(courseIndex, 1);
                course.enrolledStudents.splice(studentIndex, 1);
                await student.save();
                await course.save();
                res.json({ isEnrolled: true });
            }
        }
    }
    catch (err) {
        res.json(err)
    }
}

exports.DeleteAccount = async (req, res) => {
    try {
        const instructor = await Student.findByIdAndDelete(req.user);
        res.json({ message: "Success" })
    }
    catch (err) {
        res.json(err)
    }
}

exports.StudentHome = async (req, res) => {
    try {
        var courses = await Course.find().populate("Instructor").populate("courseVideos")
        var instructors = await Instructor.find();
        res.json({ courses, instructors })
    }
    catch (err) {
        res.json(err)
    }
}

exports.Follow = async (req, res) => {
    const { id } = req.params;
    const instructor = await Instructor.findById(id);
    const student = await Student.findById(req.user);

    if (!instructor.followers.includes(req.user)) {
        instructor.followers.push(req.user)
        student.following.push(id)
        await student.save()
        await instructor.save()
        res.json({ isfollowed: true })
    }
    else {
        const instructorIndex = student.following.indexOf(id);
        const studentIndex = instructor.followers.indexOf(req.user);
        if (instructorIndex !== -1 && studentIndex !== -1) {
            student.following.splice(instructorIndex, 1);
            instructor.followers.splice(studentIndex, 1);
            await student.save();
            await instructor.save();
            res.json({ isfollowed: false });
        }
    }
}

exports.Unfollow = async (req, res) => {
    try {
        const { id } = req.params;
        const instructor = await Instructor.findById(id);
        const student = await Student.findById(req.user);

        const instructorIndex = student.following.indexOf(id);
        const studentIndex = instructor.followers.indexOf(req.user);

        if (instructorIndex !== -1 && studentIndex !== -1) {
            student.following.splice(instructorIndex, 1);
            instructor.followers.splice(studentIndex, 1);

            await student.save();
            await instructor.save();

            res.json({ isfollowed: false });
        } else {
            res.status(404).json({ error: "User not found in the respective arrays." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.StudentProfileimg = async (req, res) => {
    try {
        var student = await Student.findById(req.user)
        cloudinary.uploader.upload(req.file.path, (err, result) => {
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }
            }
            student.profileimg = result.secure_url;
            student.save();
            res.json(student)
        })
    }
    catch (err) {
        res.json(err)
    }
}

exports.UpdateProfileStudent = async (req, res) => {
    const { name, phone, qualification, institution, course } = req.body
    try {

        var updated = await Student.findByIdAndUpdate(req.user, {
            $set: {
                name: name,
                phone: phone,
                qualification: qualification,
                institution: institution,
                course: course
            }
        })
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json(err);
    }
}
