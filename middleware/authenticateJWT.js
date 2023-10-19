const jwt = require('jsonwebtoken');
require("dotenv").config();
const Student = require("../models/studentModel.js")


exports.instructor_authenticateJWT = async (req, res, next) => {
    
    let instructor_token = req.headers['authorization'];
    if(instructor_token){
        instructor_token = instructor_token.split(' ')[1];
        jwt.verify(instructor_token, process.env.JWT_SECRET, (err, valid) => {
            if(err){
                res.status(401).json({ result: "Please provide valid token"})
            }
            else{
                const { userId } = jwt.verify(instructor_token, process.env.JWT_SECRET);
                req.user = userId;
                // console.log(req.user)
                next();
            }
        })
    }
    else{
        res.status(403).json({result: "Please add token with header"})
    }
}

exports.student_authenticateJWT = async (req, res, next) => {
    
    let student_token = req.headers['authorization'];
    if(student_token){
        student_token = student_token.split(' ')[1];
        jwt.verify(student_token, process.env.JWT_SECRET, (err, valid) => {
            if(err){
                res.status(401).json({ result: "Please provide valid token"})
            }
            else{
                const { userId } = jwt.verify(student_token, process.env.JWT_SECRET);
                req.user = userId;
                // console.log(req.user)
                next();
            }
        })
    }
    else{
        res.status(403).json({result: "Please add token with header"})
    }
}

