var mongoose = require("mongoose");

var employeeSchema = new mongoose.Schema({
	firstname : String,
	lastname : String,
	email : String,
	gender : {
		type : String,
		enum : ["Male", "Female"]
	},
	address : String
})



mongoose.model("Employee", employeeSchema);