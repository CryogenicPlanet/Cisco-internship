var app = angular.module("quickbooks", ["ngRoute"]);
/*
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "homepage.html"
    });
  });
  */

app.controller('loginController', function($scope,$http) {
    $scope.login = function() {
            alert("Inside Login Method");
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
                alert("Received: " +  $scope.success);
            }, function myError(response) {
                $scope.error = response.statusText;
                alert("Received Error: " +  $scope.error);
            });
        }
});