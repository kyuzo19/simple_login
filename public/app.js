(function () { 
	angular
		.module("loginApp", ["angular-jwt"])
		.config(function ($httpProvider){
			$httpProvider.interceptors.push("authInterceptor");
		})
		.factory("authStatus", authStatus)
		.factory("authInterceptor", authInterceptor)
		.controller("LoginCtrl", LoginCtrl)
		.controller("LogoutCtrl", LogoutCtrl)
		.controller("EmployeeCtrl", EmployeeCtrl)
		
	function authStatus () {
 			var auth = {
      			isLoggedIn: false
		};
		return auth;		
	};
	
	authInterceptor.$interceptor = ["$location", "$window", "authStatus"];
	
	function authInterceptor ($location, $window, authStatus){
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
	};
	
	LoginCtrl.$inject = ["$http", "jwtHelper", "$window", "authStatus"];

	function LoginCtrl ($http, jwtHelper, $window, authStatus){
		var vm = this;
		vm.isLoggedIn = function() {
			if (authStatus.isLoggedIn) {
				return true;
			} else {
				return false;
			}
		};
		
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
		
		
	};
	
	LogoutCtrl.$inject = ["$window", "$location", "authStatus"]

	function LogoutCtrl ($window, $location, authStatus) {
		var vm = this;
		vm.isLoggedIn = function () {
			if (authStatus.isLoggedIn) {
				return true;
			} else {
				return false;
			}
		};
		vm.logout = function () {
			
			authStatus.isLoggedIn = false;
			delete $window.sessionStorage.token;
			$location.path("/");
			
		};
	};
	
	EmployeeCtrl.$inject = ["$http", "authStatus"]
	function EmployeeCtrl($http, authStatus) {
		var vm = this;
		vm.isLoggedIn = function() {
			if (authStatus.isLoggedIn) {
				return true;
			} else {
				return false;
			};
		};
		$http.get("/employees").then(function(response){
			vm.test = response.data;
		}).catch(function(err){
			console.log(err);
		})
		
	}
	
})();





