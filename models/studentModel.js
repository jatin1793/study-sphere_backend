const mongoose = require('mongoose')
const Course=require('./courseModel')

const Student = new mongoose.Schema(
	{
		token: { type:String, default:""},

		phone: { type:Number, required: true},
		email: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		password: { type: String, required: true },
		profileimg: { type: String , default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_RlT-ytB9A_TQFLKMqVYpdJiiRbckTCThmw&usqp=CAU"},

		institution: {type: String, required: true },
		qualification: {type: String, required: true },
		course: {type: String, required: true },

		joinedcourses:[{type:mongoose.Types.ObjectId,ref:'CourseData'}],
		following:[{type:mongoose.Types.ObjectId,ref:'InstructorData'}],
	},
)

module.exports = mongoose.model('StudentData', Student);

