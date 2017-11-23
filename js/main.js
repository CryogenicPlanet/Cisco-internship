var app = angular.module("quickbooks", ["ngRoute", 'ui.materialize']); // Defining The Applications Quickbooks
var scripts = ['/js/Services/userService.js', '/js/Services/addBookService.js', '/js/Services/newBooksService.js', '/js/Services/searchService.js', '/js/Services/showPagesService.js'];
var imported = document.createElement('script');
for (var src of scripts) {
    console.log(src);
    imported.src = src;
    document.head.appendChild(imported);
} 
// Route
app.config(function($routeProvider) { // Making the Router Provider

    $routeProvider
        .when("/login", { // Url Login
            templateUrl: "login.html", // Template Url  
            controller: "loginController" // Linked Controller
        })
        .when("/", {
            templateUrl: "homepage.html",
            controller: "homeController"
        })
        .when("/username/", {
            templateUrl: "user.html",
            controller: "userController"
        })
        .when("/add", {
            templateUrl: "addbook.html",
            controller: "addBookController"
        })
        .when("/authorbook", {
            templateUrl: "authors.html",
            controller: "showAuthorController"
        })
        .when("/genres", {
            templateUrl: "genres.html",
            controller: "showGenreController"
        });
});

// Controllers
app.controller('showAuthor', function($scope, showAuthorService) {

    var books = showAuthorService.getResponses();
    $scope.books = books;
});
app.controller('showGenreController', function($scope, showGenreService) {
    $scope.getgenres = function(string) {

    }
});
app.controller('baseController', function($scope, userService) {

});
app.controller('loginController', function($scope, $location, $timeout, userService) { // Controller parameters $scope, $http, $location, $timeout From Angular Itself. userService and newBooksService are user defined Property
    this.initialize = function() { // Intitialization Function
        $scope.loading = true; // Scope Variable for loading
        $scope.loginPage = false; // Scope Variable For loginPage
        $timeout(function() { // Timeout
            $scope.loading = false;
            $scope.loginPage = true;
        }, 3000);
    }
    $scope.login = function() { // Call Login
        userService.login($scope.lEmail, $scope.lPassword)
            .then(function(token) { // Promise Succesful
                $location.path("/");
            })
            .catch(function(error) { // Promise Unsuccesful
                // Show the whole page
                Materialize.toast('<p class="flow-text white-text">' + error + '</p>', 2000); // Materialised Css

            });
    };
    this.initialize(); // Function called to Intitialize
    //console.log('test');
});
// Beyond this Point Any Doubt Please Ping Me Immediately, I will reply as soon as possible or comment that line
app.controller('addBookController', function($scope, userService, addBookService) {
    var data = {}; //what does this do?
    var isNew = false;
    angular.element(document).ready(function() { //what is this?
        $('select').material_select();
        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year,
            today: 'Today',
            clear: 'Clear',
            close: 'Ok',
            closeOnSelect: true // Close upon selecting a date,
        });
        $(document).ready(function() {
            $('input#year').characterCounter();
        });


    });
    $scope.bookSearch = function(keyEvent) {
        var searchBook = document.getElementById("book").value;
        if (searchBook.length >= 2) {
            $scope.book = true;
            $scope.loading = true;
            addBookService.getBooks(searchBook)
                .then(function(response) {
                    $scope.books = response;
                    $scope.listBooks = true
                })
                .catch(function(err) {
                    $scope.cardMsg = "This book is unavailable";
                    $scope.newBook = true;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }
    }
    $scope.authorSearch = function(keyEvent) {
        var searchAuthor = document.getElementById("author").value;
        if (searchAuthor.length > 2) {
            $scope.author = true;
            $scope.loadingAuthor = true;
            addBookService.getAuthors(searchAuthor)
                .then(function(response) {
                    $scope.authors = response.data;
                    $scope.listAuthors = true;
                })
                .catch(function(err) {
                    $scope.cardAuthorMsg = "This author is not there in the database";
                })
                .finally(function() {
                    $scope.loadingAuthor = false;
                });
        }
    }
    $scope.genreSearch = function(keyEvent) {
        var searchGenre = document.getElementById("genre").value;
        if (searchGenre.length > 2) {
            $scope.genre = true;
            $scope.loadingGenre = true;
            addBookService.getGenre(searchGenre)
                .then(function(response) {
                    console.log(response);
                    $scope.genres = response.data;
                    $scope.listGenre = true;
                })
                .catch(function(err) {
                    $scope.cardGenreMsg = "This genre is not there in the database";
                })
                .finally(function() {
                    $scope.loadingGenre = false;
                });
        }
    }
    var newBookRadio = document.getElementById("newBook"); //why newBookRadio
    $scope.newBookClick = function() {
        data.name = document.getElementById("book").value;
        console.log("New book");
        isNew = true;
        console.log("Book name:" + data.name);
        document.getElementById("book").disabled = true;
        $scope.book = false;
        $scope.newBook = true;
    }
    $scope.newAuthorClick = function() {
        data.author = document.getElementById("author").value;
        console.log("Author name:" + data.author);
        document.getElementById("author").disabled = true;
        $scope.author = false;
    }
    $scope.newGenreClick = function() {
        data.genre = document.getElementById("genre").value
        console.log("Genre name:" + data.genre);
        document.getElementById("genre").disabled = true;
        $scope.genre = false;
    }
    $scope.addBook = function() {
        console.log("In Function");
        if (isNew === false) {
            console.log("Ubid");
            var ubid = $("input[name=books]:checked").val();
            var data = {
                ubid: ubid,
                description: document.getElementById("description").value
            }
            addBookService.addBook(data);
        }
        else {
            console.log("new Book")
            data.year = document.getElementById("year").value;
            if (!($("input[name=authors]:checked").val() == 'undefined')) {
                var uaid = $("input[name=authors]:checked").val();
                data.uaid = uaid;
            }
            if (!($("input[name=genres]:checked").val() == 'undefined')) {
                var ugid = $("input[name=genres]:checked").val();
                data.ugid = ugid;
            }
            console.log(data);
            addBookService.addBook(data);
        }
    }
});
app.controller('homeController', function($scope, $location, newBooksService, borrowService, userService, searchService) {
    $scope.homepage = false;
    $scope.addBook = function() {
        $location.path("/add");
    }
    $scope.myFunct = function(keyEvent) {
        if (keyEvent.which === 13) {
            searchService.finalSearch($scope.search)
                .then(function(response) {
                    $scope.searchPage = true;
                    $scope.showBooks = false;
                    $scope.view = "search";
                    var books = searchService.getResponses();
                    //console.log(books);
                    $scope.books = books;
                });
        }
    }
    $scope.initialize = function() { // Function Defined here
        var token = userService.getToken();
        $scope.loading = true;
        $scope.page = false;
        if (token) {
            $scope.homepage = true;
            newBooksService.get()
                .then(function(responses) {
                    $scope.view = "books";
                    $scope.books = responses;
                    $scope.page = true;
                }).catch(function(err) {
                    Materialize.toast('<p class="flow-text red-text">' + err.data.message + '</p>', 2000);
                })
                .finally(function() {
                    // called no matter success or failure
                    $scope.loading = false;
                });
        }
        else {
            $location.path("/login");
        }

    };
    $scope.borrow = function(book) {
        borrowService.borrow(book.uuid, book.ubid)
            .then(function(response) {
                Materialize.toast('<p class="flow-text white-text">' + response.data.message + '</p>', 2000);

            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">' + error.data.message + '</p>', 2000);
            });
    };
    //Here
    $scope.initialize();
});
app.controller('userController', function($scope, $routeParams, userService) {
    $scope.userPage = false;
    $scope.loading = true;
    $scope.initialize = function() {
        $scope.name = userService.getUsername();
        $scope.books = userService.getBooks();
        $scope.following = userService.getFollowing();
        $scope.followers = userService.getFollowers();

    }
    if (!(userService.getBooks())) {
        userService.getDetails()
            .then(function(data) {
                $scope.initialize();
            })
            .finally(function(data) {
                $scope.loading = false;
                $scope.userPage = true;
                angular.element(document).ready(function() { //what is this?
                    $(document).ready(function() {
                        $('ul.tabs').tabs();
                    });

                });
            });
    }
    else {
        $scope.initialize();
        $scope.loading = false;
        $scope.userPage = true;
        angular.element(document).ready(function() { //what is this?
            $(document).ready(function() {
                $('ul.tabs').tabs();
            });

        });
    }
})
