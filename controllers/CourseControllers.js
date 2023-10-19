const mongoose = require('mongoose');
const Course = require('../models/courseModel');
const Instructor = require('../models/instructorModel');
const Student = require('../models/studentModel');
const cloudinary = require('../middleware/cloudinary');


exports.createCourse = async (req, res) => {
    try{
        const { courseTitle, courseDomain,courseDescription } = req.body;
        
        const loggedinuser = await Instructor.findById(req.user)
        cloudinary.uploader.upload(req.file.path, (err, result) => {
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }
                }
                // student.profileimg = result.secure_url;
                // student.save();
                
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
                res.json({course})
        })
    }catch(err){
        res.json(err)
    }
}

exports.AllCourses = async (req, res) => {
    try{
       const allcourses = await Course.find()
       res.json(allcourses)
    }catch(err){
        res.json({err})
    }
}

exports.deleteCourse = async (req, res) => {
    try{
        const instructor = Instructor.findById(req.user);
        instructor.coursescreated.pull(req.params.courseid);
        await instructor.save();
        // await Student.updateMany({: req.params.courseid }, { $unset: { courseId: 1 } });

        console.log(req.params.courseid)
        const course =await Course.findOneAndDelete ({_id: req.params.courseid})
        course.save();
        
        res.json({message : "course deleted"})
    }catch(err){
        res.json(err)
    }
}

exports.showCoursedetails = async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id).populate("Instructor").populate("courseVideos")
    res.json(course)
}