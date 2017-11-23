var app = angular.module("quickbooks");

app.factory('addBookService', function($http, userService) {
    var addService = [];

    addService.getBooks = function(book) {
        return $http({
            method: "GET",
            url: `https://cisco-backend-cryogenicplanet.c9users.io/searchBooks?search=${book}`, //what does ${book} do?
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