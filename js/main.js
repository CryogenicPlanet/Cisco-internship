var app = angular.module("quickbooks", ["ngRoute"]);

app.config(function($routeProvider) {
  
   $routeProvider
    .when("/", {
        templateUrl : "login.html",
        controller: "loginController"
    })
    .when("/home", {
        templateUrl : "homepage.html",
        controller: "homeController"
    });
});

app.factory('userService', function($http) {
    var userService = {};
    userService.uuid = -1;
    userService.login = function(email, password){
        var url = "https://cisco-backend-cryogenicplanet.c9users.io/login";
        var data = {email: email, pword: password};
        return $http({
            method : "POST",
            contentType: 'application/json',
            data : JSON.stringify(data),
            cache: true,
            url : url
        }).then(function (response){
           if(response.data.status == true){
               userService.uuid = response.data.uuid;
                return response.data.uuid;
           } else {
               throw Error(response.data.message);
           }
        });
    };
    userService.getUuid = ()=>{return userService.uuid};
    return userService;
});
app.service('newBooksService',function($http, userService){
    var newBooks = [];
    newBooks.get = function(){
       return  $http({
            method : "GET",
            url : `https://cisco-backend-cryogenicplanet.c9users.io/newbooks?uuid=` + userService.getUuid()
             /* headers : {'Accept' : 'application/json'},
            params: JSON.stringify({uuid:userId}) */
        }).then(function(responses){
            return responses.data;
        })
    }
    return newBooks;
});

app.controller('baseController', function($scope, userService) {
    
});

app.controller('loginController', function($scope, $http, $location, userService, newBooksService) {
    $scope.login = function() {
        userService.login($scope.lEmail, $scope.lPassword)
        .then(function(uuid) {
            $location.path("/home");
        })
        .catch(function(error) {
                // Show the whole page
            Materialize.toast('<p class="flow-text white-text">' + error + '</p>', 2000);            
            
        });
    };
    console.log('test');
});


app.controller('homeController', function($scope, newBooksService) {
    console.log("Homepage!");
    $scope.initialize = function() {
        newBooksService.get()
        .then(function(responses){
            $scope.books = responses;
            console.log($scope.books);
        });
    };
    $scope.initialize();
});