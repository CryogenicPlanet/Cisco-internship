var app = angular.module("quickbooks", ["ngRoute"]); // Defining The Applications Quickbooks
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
        .when("/username/:userId", {
            templateUrl: "user.html",
            controller: "userController"
        })
        .when("/add", {
            templateUrl: "addbook.html",
            controller: "addBookController"
        });
});
// Factory
app.factory('userService', function($http) { // This is Factory, Google What a Factory is. Hash the parameter of $http to send requests with
    var userService = {}; // Json Object
    var username; // Variable
    userService.login = function(email, password) { // Well, what does this suggest?
        var url = "https://cisco-backend-cryogenicplanet.c9users.io/login"; // Url 
        var data = { email: email, pword: password }; // Data is email and passsword
        return $http({ // Returning the function of http to the previous function login()
                method: "POST", // Type POST
                contentType: 'application/json', // Datatype
                data: JSON.stringify(data), // Data here
                cache: true, // Cache
                url: url // Url
            }).then(function(response) { // Promise, Basically the program promises to come here when the function is succesfull and gets data back
                localStorage.setItem("token", response.data.token); // This is Local Storage which is like cookies to keep you logged so you don't need to keep logging in
                sessionStorage.setItem('token', response.data.token);
                userService.getDetails(); // This calls a function to get all the user's details
                return response.data.token; // return the token to http function
            })
            .catch(function(response) { // Promise, Basically the program promises to come here when the function is unsucessful and throws an error
                throw Error(response.data.message); // This throws an error
            });
    };
    userService.getDetails = function() { // This is function to get your details
        return $http({ // Returning the function of http to previous function getDetails()
            method: "GET", // Type GET
            url: `https://cisco-backend-cryogenicplanet.c9users.io/userDetails`, // Url
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() }, // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) { // Promise sucessful
            username = responses.data.response.name; //Username
            localStorage.setItem("username", username); // Local Storage
            var usersBooks = JSON.stringify(responses.data.response.books); // Making it JSON
            var followers = JSON.stringify(responses.data.response.followers); // Making it JSON
            var following = JSON.stringify(responses.data.response.following); // Making it JSON
            sessionStorage.setItem("books", usersBooks); // SessionStorage slightly different from Local storage this is stored only for that session like till you close tab or a few mins longer than that
            sessionStorage.setItem("followers", followers);
            sessionStorage.setItem("following", following);
            return responses.data;
        });
    }
    // Function Declaring in one line, Calm Down, Don't worry about it
    userService.getBooks = () => { return JSON.parse(sessionStorage.getItem("books")); }; // Function returns all the books of your users
    userService.getFollowers = () => { return JSON.parse(sessionStorage.getItem("followers")); }; // Function returns all followers of the users
    userService.getFollowing = () => { return JSON.parse(sessionStorage.getItem("following")); }; // Function returns all following of the users
    userService.getUsername = () => { return localStorage.getItem("username"); }; // Function returns of the username of the user
    userService.getToken = () => { return localStorage.getItem("token"); }; // Function returns of token of the user
    return userService;
});
// Services
app.service('newBooksService', function($http, userService) { // New Book Service, Act like Class in Java
    var newBooks = []; // Blank array
    newBooks.get = function() { // Function to get New Books
        return $http({ // By now you should know what this
            method: "GET",
            url: `https://cisco-backend-cryogenicplanet.c9users.io/newbooks`,
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() }, // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) { // Promise Success
            newBooks.responses = responses.data; // Return
            return responses.data;
        });
    }
    newBooks.getResponses = () => { return newBooks.responses };
    return newBooks;
});
app.service('borrowService', function($http, userService) { // Borrow Service
    var borrowService = [];
    borrowService.borrow = function(lender, ubid) { // Borrow books
        var data = { // Data from parameters
            lender: lender,
            ubid: ubid
        };
        // Loggin this data
        return $http({ // Function
            method: "POST",
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() }, // Setting Headers, Function call to get getToken() to send to db
            data: JSON.stringify(data),
            cache: true,
            url: `https://cisco-backend-cryogenicplanet.c9users.io/borrow` // Url
        })
    };
    return borrowService; // returns this data
});
app.service('searchService', function($http) {
    var searchService = [];
    searchService.finalSearch = function(toSearch) {
        { // Function to get New Books
            return $http({ // By now you should know what this
                method: "GET",
                url: `https://cisco-backend-cryogenicplanet.c9users.io/search?search=${toSearch}`,
                headers: { 'Content-Type': 'application/json' } // Setting Headers, Function call to get getToken() to send to db
            }).then(function(responses) { // Promise Success

                //console.log(responses.data);
                searchService.responses = responses.data; // Return
                return responses.data;
            });
        }
    }
    searchService.getResponses = () => { return searchService.responses };
    return searchService;

});
// service for add books 
app.factory('addBookService', function($http, userService) {
    var addService = [];

    addService.getBooks = function(book) {
        return $http({
            method: "GET",
            url: `https://cisco-backend-cryogenicplanet.c9users.io/searchBooks?search=${book}`,//what does ${book} do?
            headers: { 'Content-Type': 'application/json' },
            // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) {
            return responses.data;
        });
    }
    addService.addBook = function(data) {
        { // Function to get add Books to profile
            return $http({ // Function
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() }, // Setting Headers, Function call to get getToken() to send to db
                data: JSON.stringify(data),
                cache: true,
                url: `https://cisco-backend-cryogenicplanet.c9users.io/addBook` // Url
            }).then(function(responses) {

            });
        }
    }


    addService.getAuthors = function(author) {
        return $http({
            method: "GET",
            url: `https://cisco-backend-cryogenicplanet.c9users.io/searchAuthor?search=${author}`,
            headers: { 'Content-Type': 'application/json' },
            // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) {
            return responses;

        });
    }
    addService.getGenre = function(genre) {
        return $http({
            method: "GET",
            url: `https://cisco-backend-cryogenicplanet.c9users.io/searchGenre?search=${genre}`,
            headers: { 'Content-Type': 'application/json' },
            // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) {
            return responses;

        });
    }
    return addService;
});

app.service('showAuthorService', function($http){
    var authorbooks = [];
    authorbooks.getBooksAuthor = function(){
        return $http({
            method: "GET",
            url: `https://cisco-backend-cryogenicplanet.c9users.io/searchBooks?search=${book}`, //Books is variable which is passed to the function. also you can pass it to that url it will be a different url with author id not the name  
            headers: { 'Content-Type': 'application/json' },
            // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) {
            return responses.data;
        });
    }
    return showAuthorService;
    
});
// Controllers

app.controller('showAuthor', function(showAuthorService){
});

app.controller('baseController', function($scope, userService) {

});

app.controller('loginController', function($scope, $location,$timeout, userService) { // Controller parameters $scope, $http, $location, $timeout From Angular Itself. userService and newBooksService are user defined Property
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
    var data = {};//what does this do?
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
    var userId = $routeParams.userId;
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
            });
    }
    else {
        $scope.initialize();
        $scope.loading = false;
        $scope.userPage = true;
    }
})
