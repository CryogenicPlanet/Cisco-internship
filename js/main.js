var app = angular.module("quickbooks", ["ngRoute", 'ui.materialize']); // Defining The Applications Quickbooks

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
        .when("/username/:userId/:username", {
            templateUrl: "user.html",
            controller: "userController"
        })
        .when("/add", {
            templateUrl: "addbook.html",
            controller: "addBookController"
        })
        .when("/authors/:authorId", {
            templateUrl: "authors.html",
            controller: "showAuthorController"
        })
        .when("/genres/:genreName", {
            templateUrl: "genres.html",
            controller: "showGenreController"
        })
        .when("/books/:bookName", {
            templateUrl: "books.html",
            controller: "showBookController"
        });
});
// Controllers
//Controller for the author page i.e showAuthorService
app.controller('showAuthorController', function($scope, $location, $routeParams, showAuthorService) {
    this.initialize = function() {
        $scope.authorpage = false;
        $scope.authorloading = true;
    }
    var authorId = $routeParams.authorId;
    showAuthorService.getResponses(authorId).then(function(authorbooks) {
        $scope.authorName = authorbooks[0].author.Name;
        $scope.authorbooks = authorbooks;
    }).finally(function() {
        $scope.authorloading = false;
        $scope.authorpage = true;
    });

    $scope.openGenre = function(genrename) {
        $location.path("/genres/" + genrename);
    }

});

app.controller('showBookController', function($scope, $location, $routeParams, addBookService) {
    this.initialize = function() {
        $scope.bookpage = false;
        $scope.bookloading = true;
    }
    var bookname = $routeParams.bookName;
    console.log(bookname);
    var data = {
        name: bookname
    }
    addBookService.getBookDetails(data)
        .then(function(bookdetails) {
            console.log(bookdetails);
            $scope.bookname = bookname;
            $scope.authorname = bookdetails[0].authorname;
            $scope.genrename = bookdetails[0].genrename;
            $scope.year = bookdetails[0].year;
            $scope.owners = bookdetails[0].owners;
            // $scope.authorbooks = authorbooks;
        }).finally(function() {
            $scope.bookloading = false;
            $scope.bookpage = true;
        });


    $scope.openAuthor = function(authorname) {
        $location.path("/authors/" + authorname);
    }

    $scope.openGenre = function(genrename) {
        $location.path("/genres/" + genrename);
    }
});

//Controller for the genre page i.e showGenreService
app.controller('showGenreController', function($scope, $location, $routeParams, showGenreService) {
    this.initialize = function() {
        $scope.genrepage = false;
        $scope.genreloading = true;
    }
    var genreName = $routeParams.genreName;
    showGenreService.getResponses(genreName)
        .then(function(genrebooks) {
            $scope.genreName = $routeParams.genreName;
            $scope.genrebooks = genrebooks;
        }).finally(function() {
            $scope.genreloading = false;
            $scope.genrepage = true;
        });

    $scope.openAuthor = function(authorname) {
        $location.path("/authors/" + authorname);
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
});
// Beyond this Point Any Doubt Please Ping Me Immediately, I will reply as soon as possible or comment that line
app.controller('addBookController', function($scope, userService, addBookService) {
    var data = {}; //what does this do?
    var isNew = false;
    angular.element(document).ready(function() {
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
        document.getElementById("book").disabled = true;
        $scope.book = false;
        $scope.newBook = true;
    }
    $scope.newAuthorClick = function() {
        data.author = document.getElementById("author").value;
        document.getElementById("author").disabled = true;
        $scope.author = false;
    }
    $scope.newGenreClick = function() {
        data.genre = document.getElementById("genre").value
        document.getElementById("genre").disabled = true;
        $scope.genre = false;
    }
    $scope.addBook = function() {
        console.log("In Function");
        if (isNew === false) {
            var ubid = $("input[name=books]:checked").val();
            var data = {
                ubid: ubid,
                description: document.getElementById("description").value
            }
            addBookService.addBook(data);
        }
        else {
            data.year = document.getElementById("year").value;
            if (!($("input[name=authors]:checked").val() == 'undefined')) {
                var uaid = $("input[name=authors]:checked").val();
                data.uaid = uaid;
            }
            if (!($("input[name=genres]:checked").val() == 'undefined')) {
                var ugid = $("input[name=genres]:checked").val();
                data.ugid = ugid;
            }
            addBookService.addBook(data);
        }
    }
});
app.controller('homeController', function($scope, $location, newBooksService, borrowService, userService, searchService, requestsService, borrowedBooksService) {
    $scope.homepage = false;
    $scope.openUser = function(user) {
        $location.path("/username/" + user.uuid + "/" + user.name);
    }
    $scope.addBook = function() {
        $location.path("/add");
    }

    $scope.openAuthor = function(authorname) {
        $location.path("/authors/" + authorname);
    }

    $scope.openGenre = function(genrename) {
        $location.path("/genres/" + genrename);
    }

    $scope.openBook = function(book) {
        $location.path("/books/" + book.bookname);
    }

    $scope.openUser = function(username) {
        $location.path("/username/" + userService.getUuid() + "/" + userService.getUsername());
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
                    $scope.loading = false;
                    $(document).ready(function() {
                        $('.tooltipped').tooltip({ delay: 50 });
                        $('.dropdown-button').dropdown({
                            inDuration: 300,
                            outDuration: 225,
                            constrainWidth: false, // Does not change width of dropdown to that of the activator
                            hover: false, // Activate on hover
                            gutter: 10, // Spacing from edge
                            belowOrigin: true, // Displays dropdown below the button
                            alignment: 'left', // Displays dropdown with edge aligned to the left of button
                            stopPropagation: false // Stops event propagation
                        });
                        $('.modal').modal({
                            dismissible: true, // Modal can be dismissed by clicking outside of the modal
                            opacity: 1, // Opacity of modal background
                            inDuration: 300, // Transition in duration
                            outDuration: 200, // Transition out duration
                            startingTop: '4%', // Starting top style attribute
                            endingTop: '10%', // Ending top style attribute
                            ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                                console.log(modal, trigger);
                            },
                            complete: function() {} // Callback for Modal close
                        });
                    });
                });
        }
        else {
            $location.path("/login");
        }

    };

    $scope.myFunct = function(keyEvent) {
        if (keyEvent.which === 13) {
            searchService.finalSearch($scope.search)
                .then(function(response) {
                    $scope.searchPage = true;
                    $scope.showBooks = false;
                    $scope.view = "search";
                    var books = searchService.getResponses();
                    $scope.books = books;
                });
        }
    }

    $scope.openMineModal = function() {
        $('#modal1').modal('open');
    }
    $scope.openOtherModal = function() {
        $('#modal2').modal('open');
    }
    $scope.openBorrowedModal = function() {
        $('#modal3').modal('open');
    }
    $scope.openLentModal = function() {
        $('#modal4').modal('open');
    }


    $scope.getUserRequests = function() {
        requestsService.getRequests()
            .then(function(requests) {
                $scope.requests = requests;
                for (let request of requests) {
                    $scope.expelreplyid(request.URID);
                }
                if (requests.length == 0) {
                    Materialize.toast('<p class="flow-text green-text">You have no book <br> requests!!</p>', 2000);
                }
            })
            .catch(function(err) {
                Materialize.toast('<p class="flow-text red-text">' + err.data.message + '</p>', 2000);
            });
    }

    $scope.getSentRequests = function() {
        requestsService.getSentRequests()
            .then(function(sentrequests) {
                $scope.sentrequests = sentrequests;
                if (sentrequests.length == 0) {
                    Materialize.toast('<p class="flow-text green-text">You have not sent any book <br> requests!!</p>', 2000);
                }
            })
            .catch(function(err) {
                Materialize.toast('<p class="flow-text red-text">' + err.data.message + '</p>', 2000);
            });
    }

    var replyarr = [];
    $scope.ReplyUserRequests = function(response, relatedRequest) {
        var data = {
            response: response,
            request: relatedRequest
        }
        requestsService.addResponse(data)
            .then(function(response) {
                Materialize.toast('<p class="flow-text white-text">' + response + '</p>', 2000);
                replyarr.push(relatedRequest.URID);
            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">Sorry, your request to reply failed' + error.data.message + '</p>', 2000);
            });
    }

    $scope.replysuccess = function(id) {
        if (replyarr.indexOf(id) != -1)
            return true;
        else
            return false;
    }

    $scope.expelreplyid = function(id) {
        if (replyarr.indexOf(id) != -1)
            replyarr.splice(replyarr.indexOf(id));
    }

    $scope.getBorrowedBooks = function() {
        borrowedBooksService.getBorrowedBooks()
            .then(function(borrowedbooks) {
                $scope.borrowedbooks = borrowedbooks;
                for (let borrowedbook of borrowedbooks) {
                    $scope.expelreturnid(borrowedbook.UBOID);
                }
                if (borrowedbooks.length == 0) {
                    Materialize.toast('<p class="flow-text green-text">You have no borrowed books</p>', 2000);
                }
            })
            .catch(function(err) {
                Materialize.toast('<p class="flow-text red-text">' + err.data.message + '</p>', 2000);
            });
    }

    var returnarr = [];
    $scope.returnBorrowedBook = function(book) { //relreq = related requests
        var data = {
            borrowedBook: book
        }
        borrowedBooksService.returnBorrowedBook(data)
            .then(function(response) {
                Materialize.toast('<p class="flow-text white-text">' + response + '</p>', 2000);
                returnarr.push(book.UBOID);
            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">' + error.data.message + '</p>', 2000);
            });
    }

    $scope.returnreqsuccess = function(id) {
        if (returnarr.indexOf(id) != -1)
            return true;
        else
            return false;
    }

    $scope.expelreturnid = function(id) {
        if (returnarr.indexOf(id) != -1)
            returnarr.splice(returnarr.indexOf(id));
    }


    $scope.getLentBooksStatus = function() {
        borrowedBooksService.getLentBooksStatus()
            .then(function(lentbooks) {
                $scope.lentbooks = lentbooks;
                for (let lentbook of lentbooks) {
                    $scope.expeltakebackid(lentbook.UBOID);
                }
                if (lentbooks.length == 0) {
                    Materialize.toast('<p class="flow-text green-text">You haven\'t lent any books</p>', 2000);
                }
            })
            .catch(function(err) {
                Materialize.toast('<p class="flow-text red-text">' + err.data.message + '</p>', 2000);
            });
    }

    var takebackarr = [];
    $scope.takeBackBook = function(book) {
        var data = {
            lentbook: book
        }
        borrowedBooksService.takeBackBorrowedBook(data)
            .then(function(response) {
                Materialize.toast('<p class="flow-text white-text">' + response + '</p>', 2000);
                takebackarr.push(book.UBOID);
            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">' + error.data.message + '</p>', 2000);
            });
    }

    $scope.takebacksuccess = function(id) {
        if (takebackarr.indexOf(id) != -1)
            return true;
        else
            return false;
    }

    $scope.expeltakebackid = function(id) {
        if (takebackarr.indexOf(id) != -1)
            takebackarr.splice(takebackarr.indexOf(id));
    }


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
app.controller('userController', function($scope, $location, $routeParams, userService, featuredBooksService, profileService) {
    $scope.userPage = false;
    $scope.userloading = true;
    var userID = -1;
    
    $scope.getFeaturedBooks = function() {
        featuredBooksService.getBooks(userID) // NAME
            .then(function(featuredbooks) {
                if (featuredbooks.length == 0) {
                    $scope.featured = 0;
                }
                else {
                    $scope.featured = featuredbooks.length;
                }
                if (featuredbooks.length > 3) {
                    var temparr = [];
                    var temparr2 = [];
                    for (let iter = 0; iter < featuredbooks.length; iter++) {
                        if (iter < 3) {
                            temparr.push(featuredbooks[iter]);
                        }
                        else if (iter < featuredbooks.length) {
                            temparr2.push(featuredbooks[iter]);
                        }
                    }
                    $scope.firsthalffeaturedbooks = temparr;
                    $scope.lasthalffeaturedbooks = temparr2;
                }
                else {
                    $scope.featuredbooks = featuredbooks;
                }
            })
            .catch(function(err) {
                Materialize.toast('<p class="flow-text red-text">' + err.data.message + '</p>', 2000);
            })
            .finally(function() {

            });
    }

    $scope.addFeaturedBooks = function(book) {
        var data = {
            featuredbook: book
        }
        featuredBooksService.addFeaturedBooks(data)
            .then(function(response) {
                Materialize.toast('<p class="flow-text white-text">' + response + '</p>', 2000);
                $scope.getFeaturedBooks();
            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">' + error.data.message + '</p>', 2000);
            });
    }
    $scope.removeFeaturedBooks = function(book) {
        var data = {
            featuredbook: book
        }
        featuredBooksService.removeFeaturedBooks(data)
            .then(function(response) {
                Materialize.toast('<p class="flow-text white-text">' + response + '</p>', 2000);
                $scope.getFeaturedBooks();
            })
            .catch(function(error) {
                Materialize.toast('<p class="flow-text red-text">' + error.data.message + '</p>', 2000);
            });
    }
    $scope.initialize = function() {
        //Page
        let user = $routeParams.userId;
        if (user == userService.getUuid()) {
            $scope.name = userService.getUsername();
            $scope.books = userService.getBooks();
            $scope.following = userService.getFollowing();
            $scope.followers = userService.getFollowers();
            $scope.isMe = true;
        }
        else {
            $scope.isMe = false;
            userID = user;
            profileService.getDetails(userID, userService.getToken())
                .then(function(details) {
                    $scope.name = details.response.name;
                    $scope.books = details.response.books;
                    $scope.following = details.response.following;
                    $scope.followers = details.response.followers;
                });
        }
        $scope.getFeaturedBooks();
    }

    if (!(userService.getBooks())) {
        userService.getDetails()
            .then(function(data) {
                $scope.initialize();
            })
            .finally(function(data) {
                $scope.userloading = false;
                $scope.userPage = true;
                angular.element(document).ready(function() { //what is this?
                    $(document).ready(function() {
                        $('ul.tabs').tabs();
                        $('.modal').modal({
                            dismissible: true, // Modal can be dismissed by clicking outside of the modal
                            opacity: 1, // Opacity of modal background
                            inDuration: 300, // Transition in duration
                            outDuration: 200, // Transition out duration
                            startingTop: '4%', // Starting top style attribute
                            endingTop: '10%', // Ending top style attribute
                            ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                                console.log(modal, trigger);
                            },
                            complete: function() {} // Callback for Modal close
                        });
                    });

                });
            });
    }
    else {
        $scope.initialize();
        $scope.userloading = false;
        $scope.userPage = true;
        $scope.getFeaturedBooks();
        angular.element(document).ready(function() { //what is this?
            $(document).ready(function() {
                $('ul.tabs').tabs();
                $('.modal').modal({
                    dismissible: true, // Modal can be dismissed by clicking outside of the modal
                    opacity: 1, // Opacity of modal background
                    inDuration: 300, // Transition in duration
                    outDuration: 200, // Transition out duration
                    startingTop: '4%', // Starting top style attribute
                    endingTop: '10%', // Ending top style attribute
                    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                        console.log(modal, trigger);
                    },
                    complete: function() {} // Callback for Modal close
                });
            });
        });
    }

    $scope.openModal = function(book, isFeatured) {
        $scope.modalfeatured = isFeatured;
        $scope.modalbook = book;
        $('#modal').modal('open');
    };

    $scope.openGenre = function(genrename) {
        $location.path("/genres/" + genrename);
    };


    $scope.openAuthor = function(authorname) {
        $location.path("/authors/" + authorname);
    };
    $scope.openUser = function(user) {
        $location.path("/username/" + user.uuid + "/" + user.name);
    };
});
