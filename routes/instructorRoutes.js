const express = require('express');
const app = express.Router();
const { InstructorRegister, InstructorLogin,InstructorLogout, Instructordetails , Mycourses,UpdateProfile, showCoursedetails} = require('../controllers/InstructorAuthControllers.js');
const { createCourse, AllCourses , deleteCourse} = require("../controllers/CourseControllers.js")
const { AllVideos, DeleteVideo, uploadVideo ,getVideodetails} = require("../controllers/VideoControllers.js")

const { instructor_authenticateJWT } = require('../middleware/authenticateJWT.js');
const upload = require('../middleware/multer.js');


// Instructor         
app.post('/register', InstructorRegister);
app.post('/login', InstructorLogin)
app.post('/update', UpdateProfile)
app.post('/logout', instructor_authenticateJWT, InstructorLogout)
app.post('/details', instructor_authenticateJWT, Instructordetails)

// Courses         
app.get('/mycourses', instructor_authenticateJWT, Mycourses)
app.post('/createcourse',upload.single('file'), instructor_authenticateJWT, createCourse)
app.get('/allcourses', instructor_authenticateJWT, AllCourses)
app.delete('/course/deletecourse/:courseid',instructor_authenticateJWT, deleteCourse)
app.post('/course/:id',instructor_authenticateJWT, showCoursedetails )


// Videos       
app.post('/:id/allvideos', instructor_authenticateJWT,AllVideos)
app.delete('/deletevideo/:id', instructor_authenticateJWT,DeleteVideo)
app.post('/uploadvideo/:courseid',instructor_authenticateJWT , upload.single('file'), uploadVideo)
app.post('/video/:videoid', instructor_authenticateJWT, getVideodetails)

module.exports = app;