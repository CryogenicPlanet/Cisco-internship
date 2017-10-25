var app = angular.module("quickbooks", ["ngRoute"]);
// Route
app.config(function($routeProvider) {

    $routeProvider
        .when("/login", {
            templateUrl: "login.html",
            controller: "loginController"
        })
        .when("/", {
            templateUrl: "homepage.html",
            controller: "homeController"
        });
});

// Factory
app.factory('userService', function($http) {
    var userService = {};
    userService.login = function(email, password) {
        var url = "https://cisco-backend-cryogenicplanet.c9users.io/login";
        var data = { email: email, pword: password };
        return $http({
            method: "POST",
            contentType: 'application/json',
            data: JSON.stringify(data),
            cache: true,
            url: url
        }).then(function(response) {
            localStorage.setItem("token", response.data.token);
                sessionStorage.setItem('token', response.data.token);
                return response.data.token;
        })
        .catch(function(response){ 
        
                throw Error(response.data.message);
            });
    };
    userService.getToken = () => { return localStorage.getItem("token");};
    return userService;
});
// Services
app.service('newBooksService', function($http, userService) {
    var newBooks = [];
    newBooks.get = function() {
        return $http({
            method: "GET",
            url: `https://cisco-backend-cryogenicplanet.c9users.io/newbooks`,
             headers : {'Content-Type' : 'application/json','x-access-token' : userService.getToken()},
                    }).then(function(responses) {
            newBooks.responses = responses.data;
            return responses.data;
        });
    }
   // newBooks.getResponses = () => { return newBooks.responses };
    return newBooks;
});
app.service('borrowService', function($http, userService) {
    var borrowService = [];
    borrowService.borrow = function(lender, ubid) {
        var data = {
            lender: lender,
            ubid: ubid
        };
        console.log(data);
        return $http({
            method: "POST",
             headers : {'Content-Type' : 'application/json','x-access-token' : userService.getToken()},
            data: JSON.stringify(data),
            cache: true,
            url: `https://cisco-backend-cryogenicplanet.c9users.io/borrow`
        });
    };
    return borrowService;
});

// Controllers
app.controller('borrowController', function($scope, borrowService) {
   
});


app.controller('baseController', function($scope, userService) {

});

app.controller('loginController', function($scope, $http, $location, userService, newBooksService) {
    $scope.login = function() {
        userService.login($scope.lEmail, $scope.lPassword)
            .then(function(token) {
                $location.path("/home");
            })
            .catch(function(error) {
                // Show the whole page
                Materialize.toast('<p class="flow-text white-text">' + error + '</p>', 2000);

            });
    };

    //console.log('test');
});


app.controller('homeController', function($scope,$location, newBooksService,borrowService,userService) {
    console.log("Homepage!");
    $scope.initialize = function() { // Function Defined here
    var token = userService.getToken();
    if(token){
        console.log(token);
        newBooksService.get()
            .then(function(responses) {
                $scope.books = responses;
                console.log($scope.books);
            });
    } else {
        $location.path("/")
    }
        
    };
     $scope.borrow = function(book) {
        borrowService.borrow(book.uuid,book.ubid)
            .then(function(response) {
                console.log("sucess");
                Materialize.toast('<p class="flow-text white-text">' + response.data.message + '</p>', 2000);

            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">' + error.data.message + '</p>', 2000);
            });
    };
    //Here
    $scope.initialize();
});
