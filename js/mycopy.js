var app = angular.module("quickbooks", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "homepage.html"
    });
  });
