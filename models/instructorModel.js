const mongoose = require('mongoose')
const Course = require("./courseModel.js")

const Instructor = new mongoose.Schema(
	{
		token: { 
			type:String, 
			default:""
		},

		phone: { 
			type:Number, 
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
			type: String , 
			default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_RlT-ytB9A_TQFLKMqVYpdJiiRbckTCThmw&usqp=CAU"
		},

		qualification: {
			type: String, 
			required: true 
		},

		experience: {
			type: String, 
			required: true 
		},

		domain: {
			type: String, 
			required: true 
		},

		coursescreated:[{
			type: mongoose.Schema.Types.ObjectId,
			ref: "CourseData"
		}],

		followers: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "StudentData"
		}]
	},
)

module.exports = mongoose.model('InstructorData', Instructor);

