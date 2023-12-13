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
		},

		email: { 
			type: String,
            unique: true,
            required: [true, "Email is required"],
		},

		name: { 
			type: String, 
			required: [true, "Name is required"],
		},

		password: { 
			type: String,
			required: [true, "Password is required"],
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

