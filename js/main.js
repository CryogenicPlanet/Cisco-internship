var app = angular.module("quickbooks", ["ngRoute"]);

app.config(function($routeProvider) {
  
   $routeProvider
    .when("/", {
        templateUrl : "login.html",
        controller: "loginController"
    })
    .when("/home", {
        templateUrl : "homepage.html",
        controller: "loginController"

    });
  });

app.controller('loginController', function($scope, $http, $location) {
    $scope.login = function() {
            var url = "https://cisco-backend-cryogenicplanet.c9users.io/login";
            var data = {email: $scope.lEmail, pword: $scope.lPassword};
            $http({
                method : "POST",
               contentType: 'application/json',
                data : JSON.stringify(data),
                cache: true,
                url : url
            }).then(/*function mySuccess(response) {
                $scope.success = response.data;
                $location.path("/home");
            }, function myError(response) {
                $scope.error = response.statusText;
            } */ function sucess(response){
                 if (response.data.status == true){
             $scope.success = response.data;
                $location.path("/home");
    } else {
      // Show the whole page
       Materialize.toast('<p class="flow-text white-text">' + response.data.message + '</p>', 2000);
        $scope.error = response.statusText;
      
    }});
        
}});