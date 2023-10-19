const mongoose = require('mongoose')
const Course = require("./courseModel.js")

const Instructor = new mongoose.Schema(
	{
		token: { type:String, default:""},

		phone: { type:Number, required: true},
		email: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		password: { type: String, required: true },
		profileimg: { type: String , default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5p57WV50h3MZCCDT1mT4anit4OodyaISlcQ&usqp=CAU"},

		qualification: {type: String, required: true },
		experience: {type: String, required: true },
		domain: {type: String, required: true },

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

