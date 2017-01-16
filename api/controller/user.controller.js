var mongoose =require("mongoose");
var Users = mongoose.model("User");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jsonwebtoken");

module.exports.register = function (req, res) {
	
	Users
		.create({
			username : req.body.username,
			password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
		}, function(err, user){
			if (err) {
                res
                    .status(500)
                    .json(err)
            } else {
                res
                    .status(201)
                    .json(user)
            }
		})
};


module.exports.login = function (req, res) {
 
    
    Users
        .findOne({username : req.body.username})
        .exec(function (err, user) {
             if (err) {
                 res
                    .status(400)
                    .json(err)
             } else {
                 if(bcrypt.compareSync(req.body.password, user.password)) {
                     console.log("found user");
                     var token = jwt.sign({username : user.username}, "secret", {expiresIn : 3600});
                     
                     res
                        .status(200)
                        .json({
                            success : true,
                            token : token
                        })
                 } else {
                     res
                        .status(401)
                        .json("Unauthorized")
                 }
             }
        })
};


module.exports.auth = function (req, res, next) {
    
    if (req.headers.authorization) {
        var token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret", function(err, decoded){
            if (err){
                res
                    .status(401)
                    .json("unauthorized")
            } else {
                req.user = decoded.username;
                next()
            }
        })
    } else {
        
        res
            .status(403)
            .json(req.headers.authorization)
    }
};


module.exports.employees = function (req, res) {
    
    Users
    .find()
    .exec(function (err, employees){
        if (err){
            res
                .status(500)
                .json(err)
        } else {
            
            res
                .status(200)
                .json(employees)
            
            
        }
    })
    
};