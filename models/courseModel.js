const mongoose = require('mongoose')
const Instructor = require("./instructorModel.js")
const Video = require("./videoModel.js")

const Course = new mongoose.Schema(
    {
        courseTitle: { type: String, required: true },
        courseDomain: { type: String, required: true },
        courseVideos: [{
            type: mongoose.Types.ObjectId,
            ref: 'VideoData'
        }],
        coursePoster:{type:String,required:true},
        courseDescription:{type:String,required:true},
        enrolledStudents: { type: Array, default: [] },
        Instructor: { type: mongoose.Types.ObjectId, ref: "InstructorData" },
        courseDate: { type: Date, default: Date.now() },
    },
    
)

module.exports = mongoose.model('CourseData', Course);
