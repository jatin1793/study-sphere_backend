const mongoose = require('mongoose')
const Course = require('./courseModel')

const Student = new mongoose.Schema(
	{
		token: { 
			type: String, 
			default: "" 
		},

		phone: { 
			type: Number, 
			required: [true, "Contact is required"],
            maxLength: [10, "Contact must not exceed 10 character"],
            minLength: [10, "Contact should be atleast 10 character long"],
		},

		email: { 
			type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
			maxLength: [30, "Email must not exceed 30 character"],
			minLength: [8, "Email should be atleast 8 character long"],
		},

		name: { 
			type: String, 
			required: [true, "Name is required"],
            minLength: [6, "name should be atleast 6 character long"],
            maxLength: [15, "name should not exceed than 15 character"],
		},

		password: { 
			type: String,
            minLength: [6, "Password should have atleast 6 characters"],
		},

		profileimg: { 
			type: String, 
			default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_RlT-ytB9A_TQFLKMqVYpdJiiRbckTCThmw&usqp=CAU" 
		},

		institution: { 
			type: String, 
			required: true 
		},

		qualification: { 
			type: String, 
			required: true 
		},

		course: { 
			type: String, 
			required: true 
		},

		joinedcourses: [{ 
			type: mongoose.Types.ObjectId, 
			ref: 'CourseData' 
		}],

		following: [{ 
			type: mongoose.Types.ObjectId, 
			ref: 'InstructorData' 
		}],

		likedvideos: [{ 
			type: mongoose.Types.ObjectId, 
			ref: 'VideoData' 
		}],
	},
)

module.exports = mongoose.model('StudentData', Student);

