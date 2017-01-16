angular.module("loginApp", ["angular-jwt"])
.config(function ($httpProvider){
    $httpProvider.interceptors.push("authInterceptor");
})
.factory("authStatus", function  () {
 	var auth = {
    	isLoggedIn: false
  	};
	
	return {
    	auth: auth
  	};
	
	
})
.factory("authInterceptor", ["$location", "$window", "authStatus", function  ($location, $window, authStatus) {
	return {
		request : request,
		response : response,
		responseError : responseError,
		requestError : requestError
	};
	
	function request (config) {
		config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
            config.headers.Authorization = "Bearer " + $window.sessionStorage.token;
        };
        
        return config;
	};
	
	function response (response) {
		if (response.status === 200 && $window.sessionStorage.token && !authStatus.isLoggedIn) {
    		authStatus.isLoggedIn = true;
        };
		if (response.status === 401) {
			authStatus.isLoggedIn = false;
		};
		
		return response || $q.when(response);
	};
	
	function requestError (rejection) {
			if (rejection.status === 401 || rejection.status === 403) {
				delete $window.sessionStorage.token;
				authStatus.isLoggedIn = false;
				$location.path("/");
			}
	};
	
	function responseError () {
		
	};
}])
.controller("loginCtrl", ["$http", "jwtHelper", "$window", "authStatus", function ($http, jwtHelper, $window, authStatus){
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
			authStatus.isLoggedIn = true;
            console.log("token" + decodedToken.username);
        }).catch(function(err){
            console.log(err);
        });
        
    };
}])
.controller("employeeCtrl", ["$http", function ($http) {
   var vm = this;
    
   $http.get("/employees").then(function(response){
       vm.test = response.data;
   }).catch(function(err){
       console.log(err);
   })
    
}])