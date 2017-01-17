var mongoose = require("mongoose");


mongoose.connect("mongodb://database:database2016@ds055594.mlab.com:55594/cloudbpo");

mongoose.connection.once("open", function (){
	console.log("connected to mongolab");
});


require("./user.schema");
require("./employee.schema");