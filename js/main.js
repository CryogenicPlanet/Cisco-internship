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
        })
        .when("/loading", {
            templateUrl: "loading.html",
            controller: "loadingController"
        })
        .when("/username", {
            templateUrl: "user.html",
            controller: "userController"
        });
});
app.directive('handleLink', function() {
    var el = document.getElementById(attrs.href);
    el.scrollIntoView();
});
// Factory
app.factory('userService', function($http) {
    var userService = {};
    var username;
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
                userService.getDetails();
                return response.data.token;
            })
            .catch(function(response) {

                throw Error(response.data.message);
            });
    };
    userService.getDetails = function() {
        return $http({
            method: "GET",
            url: `https://cisco-backend-cryogenicplanet.c9users.io/userDetails`,
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() },
        }).then(function(responses) {
            username = responses.data.response.name;
            localStorage.setItem("username", username);
            var usersBooks = JSON.stringify(responses.data.response.books);
            var followers = JSON.stringify(responses.data.response.followers);
            var following = JSON.stringify(responses.data.response.following);
            sessionStorage.setItem("books", usersBooks);
            sessionStorage.setItem("followers", followers);
            sessionStorage.setItem("following", following);
            return responses.data;
        });
    }
    userService.getBooks = () => { return JSON.parse(sessionStorage.getItem("books")); };
    userService.getFollowers = () => { return JSON.parse(sessionStorage.getItem("followers")); };
    userService.getFollowing = () => { return JSON.parse(sessionStorage.getItem("following")); };
    userService.getUsername = () => { return localStorage.getItem("username"); };
    userService.getToken = () => { return localStorage.getItem("token"); };
    return userService;
});
// Services
app.service('newBooksService', function($http, userService) {
    var newBooks = [];
    newBooks.get = function() {
        return $http({
            method: "GET",
            url: `https://cisco-backend-cryogenicplanet.c9users.io/newbooks`,
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() },
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
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() },
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

app.controller('loginController', function($scope, $http, $location, $timeout, userService, newBooksService) {
    this.initialize = function() {
        $scope.loading = true;
        $scope.loginPage = false;
        $timeout(function() {
            $scope.loading = false;
            $scope.loginPage = true;
        }, 3000);
    }
    $scope.login = function() {
        userService.login($scope.lEmail, $scope.lPassword)
            .then(function(token) {
                $location.path("/");
            })
            .catch(function(error) {
                // Show the whole page
                Materialize.toast('<p class="flow-text white-text">' + error + '</p>', 2000);

            });
    };
    this.initialize();
    //console.log('test');
});


app.controller('homeController', function($scope, $location, newBooksService, borrowService, userService) {
    console.log("Homepage!");
    $scope.homepage = false;
    $scope.initialize = function() { // Function Defined here
        var token = userService.getToken();
        $scope.loading = true;
        $scope.showBooks = false;
        if (token) {
            $scope.homepage = true;
            console.log(token);
            newBooksService.get()
                .then(function(responses) {
                    $scope.books = responses;
                    $scope.showBooks = true;

                }).catch(function(err) {
                    Materialize.toast('<p class="flow-text red-text">' + err.data.message + '</p>', 2000);
                })
                .finally(function() {
                    // called no matter success or failure
                    $scope.loading = false;
                });
        }
        else {
            $location.path("/login")
        }

    };
    $scope.borrow = function(book) {
        borrowService.borrow(book.uuid, book.ubid)
            .then(function(response) {
                console.log("success");
                Materialize.toast('<p class="flow-text white-text">' + response.data.message + '</p>', 2000);

            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">' + error.data.message + '</p>', 2000);
            });
    };
    //Here
    $scope.initialize();
});
app.controller('userController', function($scope, userService) {
    $scope.userPage = false;
    $scope.loading = true;
    $scope.initialize = function() {
        console.log(userService.getUsername());
        $scope.name = userService.getUsername();
        $scope.books = userService.getBooks();
        $scope.following = userService.getFollowing();
        $scope.followers = userService.getFollowers();

    }
    if (!(userService.getBooks())) {
        userService.getDetails()
            .then(function(data) {
                console.log("getDetails Succesfull");
                console.log(JSON.parse(sessionStorage.getItem("followers")));
                $scope.initialize();
            })
            .finally(function(data) {
                $scope.loading = false;
                $scope.userPage = true;
            });
    }
    else {
        $scope.initialize();
        $scope.loading = false;
        $scope.userPage = true;
    }
})
