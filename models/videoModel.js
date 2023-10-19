const mongoose = require('mongoose')
const Instructor = require('./instructorModel')
const Student = require('./studentModel')
const Course = require("./courseModel.js")

const Video = mongoose.Schema(
    {
        videotitle: {
            type: String,
            required: true
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InstructorData"
        },
        videodescription: {
            type: String,
            required: true
        },
        videoUrl: {
            type: String,
            required: true
        },
        videoLikes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentData"
        }],
        videoCourse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CourseData'
        },
        cloudinary_id: String,
    }, { timestamps: true }
)

module.exports = mongoose.model('VideoData', Video);
