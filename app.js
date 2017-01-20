//connect to database
require("./api/data/db");
var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require("body-parser");
var routes = require("./api/routes");


app.set("port", (process.env.PORT || 5000));

app.use(function (req, res, next) {
    console.log(req.method, res.method);
    next();

});
//serve angular app files to /public
app.use(express.static(path.join(__dirname, "public")));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());



app.use(routes);

var server = app.listen(app.get("port"), function () {
    var port = server.address().port;
    console.log("Connected to port " + port);
});