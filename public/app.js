angular.module("loginApp", ["angular-jwt"])
.config(function (){
})
.controller("loginCtrl", ["$http", "jwtHelper", "$window", function ($http, jwtHelper, $window){
    var vm = this;
    
    vm.login = function (){
        
        var data = {
            username : vm.username,
            password : vm.password
        };
        
        $http.post("/users/login", data).then(function(res){
            console.log(res);
            
            $window.sessionStorage.token = res.data.token;
            var token = $window.sessionStorage.token;
            var decodedToken = jwtHelper.decodeToken(token);
            vm.username = decodedToken.username;
            console.log("token" + decodedToken.username);
        }).catch(function(err){
            console.log(err);
        });
        
    };
}])
.factory("AuthInterceptor", AuthI)

function AuthI($location, $q, $window){
    
};