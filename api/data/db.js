var mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/cbpo");

mongoose.connection.once("open", function (){
	console.log("connected to mongolab");
});


require("./user.schema");