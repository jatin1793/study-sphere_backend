const mongoose = require('mongoose');
const Course = require('../models/courseModel.js');
const Instructor = require('../models/instructorModel.js');
const Student = require('../models/studentModel.js');
const Video = require('../models/videoModel.js')
const cloudinary = require('../middleware/cloudinary.js');

exports.createCourse = async (req, res) => {
    try {
        const { courseTitle, courseDomain, courseDescription } = req.body;

        const loggedinuser = await Instructor.findById(req.user)
        cloudinary.uploader.upload(req.file.path, (err, result) => {
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }
            }

            const course = new Course({
                courseTitle,
                courseDomain,
                courseDescription,
                coursePoster: result.url,
                Instructor: loggedinuser._id,
            })
            course.save()
            loggedinuser.coursescreated.push(course._id)
            loggedinuser.save()
            res.json({ course })
        })
    } catch (err) {
        res.json(err)
    }
}

exports.AllCourses = async (req, res) => {
    try {
        const allcourses = await Course.find()
        res.json(allcourses)
    } catch (err) {
        res.json({ err })
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        
        const course = await Course.findOne({ _id: req.params.courseid })
        course.courseVideos.forEach(async (item) =>{
            const video = await Video.findOneAndDelete({_id:item})
        })
        await Course.findByIdAndDelete({ _id: req.params.courseid })
        res.json({ message: "course deleted" })
    } catch (err) {
        res.json(err)
    }
}

exports.showCoursedetails = async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id).populate("Instructor").populate("courseVideos")
    res.json(course)
}

