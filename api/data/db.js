var mongoose = require("mongoose");
var config = require("../../config");


mongoose.connect(config.dbUrl);

mongoose.connection.once("open", function (){
	console.log("connected to mongolab");
});


require("./user.schema");
require("./employee.schema");