var express = require("express");
var router = express.Router();

var userCtrl = require("../controller/user.controller");

router
	.route("/users/register")
	.post(userCtrl.register)

router
    .route("/users/login")
    .post(userCtrl.login)

router
    .route("/employees")
    .get(userCtrl.auth, userCtrl.employees)

module.exports = router;