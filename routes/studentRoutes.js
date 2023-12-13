const express = require('express');
const app = express.Router();
const { StudentRegister, StudentLogin , StudentLogout ,StudentDetails ,CheckIfEnrolled , JoinCourse, UnjoinCourse, StudentHome, Follow,  StudentProfileimg } = require('../controllers/StudentAuthControllers.js');

const { CheckIfLiked, Like } = require('../controllers/VideoControllers.js')

const { showCoursedetails }=require('../controllers/CourseControllers.js')
const {student_authenticateJWT} = require('../middleware/authenticateJWT.js');

const { getVideodetails } = require('../controllers/VideoControllers.js')
const upload = require('../middleware/multer.js');


app.post('/register', StudentRegister);

app.post('/login', StudentLogin)

app.post('/logout', student_authenticateJWT ,StudentLogout)

app.post('/details', student_authenticateJWT , StudentDetails)

app.post('/joincourse/:courseid', student_authenticateJWT ,JoinCourse )

app.post('/checkifenrolled/:courseid', student_authenticateJWT ,CheckIfEnrolled )


app.post('/home', student_authenticateJWT ,StudentHome )

app.post('/course/:id',student_authenticateJWT, showCoursedetails )

app.post('/follow/:id', student_authenticateJWT, Follow )

app.post('/profileimg', student_authenticateJWT, upload.single('file') , StudentProfileimg)

app.post('/video/:videoid', student_authenticateJWT , getVideodetails)

app.get('/video/checklike/:videoid', student_authenticateJWT , CheckIfLiked)

app.post('/video/like/:videoid', student_authenticateJWT , Like)




module.exports = app;