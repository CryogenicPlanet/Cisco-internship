//var app = angular.module("quickbooks");
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