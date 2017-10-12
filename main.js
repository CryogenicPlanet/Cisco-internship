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
            url = "/test.php";
            $http({
                method : "POST",
                datatype : "json",
                data: $.param({email: $scope.lEmail, pword: $scope.lPassword}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                url : url
            }).then(function mySuccess(response) {
                $scope.success = response.data;
                $location.path("/home");
            }, function myError(response) {
                $scope.error = response.statusText;
            }),
            $http({
                method : "GET",
                datatype : "json",
                data: $.param({email: $scope.lEmail, pword: $scope.lPassword}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                url : url
            });
        }
});
