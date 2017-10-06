var app = angular.module("quickbooks", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "file:///Users/harika/Documents/GitHub/Cisco-internship/homepage.html"
    });
  });
