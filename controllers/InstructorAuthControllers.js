const mongoose = require('mongoose')
const Instructor = require('../models/instructorModel');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const Course = require("../models/courseModel.js")
const { findOneAndUpdate } = require('../models/studentModel');
const cloudinary = require("cloudinary").v2


var salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

exports.InstructorRegister = async (req, res) => {
    const { phone, email, name, password, qualification, experience, domain } = req.body;
    try {
        const ifexists = await Instructor.findOne({ email });
        if (ifexists) {
            res.json({ alreadyExists: true })
        }
        else {
            const user = await Instructor.create({
                token: "",
                phone,
                email,
                name,
                password: bcrypt.hashSync(password, salt),
                qualification,
                experience,
                domain
            })
            const instructor_token = jwt.sign({ userId: user._id }, secret)
            user.token = instructor_token;
            await user.save();
        }
    }
    catch (error) {
        console.log(error);
    }
};

exports.InstructorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Instructor.findOne({ email });

        if (!user) {
            res.json({ InstructorExists: false, passCheck: false });
        }
        else {
            const passCheck = bcrypt.compareSync(password, user.password)
            if (passCheck) {
                const instructor_token = jwt.sign({ userId: user._id }, secret)
                Instructor.findOneAndUpdate({ email: user.email }, { instructor_token })
                    .then(() => { })
                    .catch((err) => { console.log(err) })

                res.json({ InstructorExists: true, passCheck: true, instructor_token, user })
            } else {
                res.json({ InstructorExists: true, passCheck: false });
            }
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.InstructorLogout = async (req, res) => {
    res.clearCookie("instructor_token");
    res.json({ message: "Successfully signout!" });
};

exports.Instructordetails = async (req, res) => {
    try {
        const user = await Instructor.findById(req.user)
        res.json(req.user)
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.Mycourses = async (req, res) => {
    const instructor = await Instructor.findById(req.user)
        .populate({
            path: 'coursescreated',
            populate: {
                path: 'courseVideos',
                model: 'VideoData',
            },
        })

    res.json(instructor);
}

exports.UpdateProfile = async (req,res)=>{
    const {username,phone,qualification,experiance}=req.body;
    

try {
    const instructor = await Instructor.findOneAndUpdate(
        { _id: req.user },
        {
            $set: {
                name: username,
                phone: phone,
                qualification: qualification,
                experience: experiance
            }
        }
    );
    console.log(req.user)
    res.json(instructor);
} catch (error) {
    console.error('Error updating instructor:', error);
}}

exports.InstructorProfileimg = async (req, res) => {
    try {
        var instructor = await Instructor.findById(req.user);
        console.log(req.file.path);
        cloudinary.uploader.upload(req.file.path, (err, result) => {
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }
            }
            instructor.profileimg = result.secure_url;
            instructor.save();
            res.json(instructor)
        })   
    }
    catch (err) {
        res.json(err)
    }
}


exports.showCoursedetails = async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id).populate("courseVideos")
    res.json(course);
}


