const mongooose = require('mongoose');
const Video = require('../models/videoModel');
const Instructor = require('../models/instructorModel');
const Student = require('../models/studentModel');
const Course = require("../models/courseModel")
const cloudinary = require('../middleware/cloudinary');


exports.AllVideos = async (req, res) => {
    try{
       const allvideos = await Video.find({videoCourse: req.params.id})
       res.json(allvideos)
    }catch(err){
        res.json({err})
    }
}

exports.DeleteVideo = async (req, res) => {
    try{
       const video = await Video.findOneAndDelete({_id: req.params.id})
       res.json({message: "deleted"})
    }catch(err){
        res.json({err})
    }
}

exports.uploadVideo = async (req, res) => {
    const { courseid }= req.params;
    const { videodescription,videotitle } = req.body;
    
    const instructor = await Instructor.findById(req.user)
    .populate({
        path: 'coursescreated',
        populate: {
          path: 'courseVideos',
          model: 'VideoData', 
        },
      })

      const course = await Course.findById(courseid).populate('courseVideos')
      console.log(req.file)
     cloudinary.uploader.upload(req.file.path,
        {
            resource_type: "video",
            folder: "video",
          },
        
        (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        var video = new Video({
            videotitle: req.body.videotitle,
            videoUrl: result.url,
            cloudinary_id: result.public_id,
            videodescription: req.body.videodescription,
            instructor: instructor._id, 
            videoCourse: courseid
        });

        video.save();
        course.courseVideos.push(video._id)
        course.save();
        console.log(course)
        res.json({video, course});
    }
    );
}

exports.getVideodetails = async (req, res) => {
    try{
       const video = await Video.findOne({_id: req.params.videoid}).populate("instructor")
       .populate({
        path: 'videoCourse',
        populate: {
          path: 'courseVideos',
          model: 'VideoData', 
        },
      })
       res.json(video)
    }catch(err){
        res.json(err)
    }
}