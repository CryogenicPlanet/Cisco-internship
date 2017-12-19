//var app = angular.module("quickbooks");
app.service('showAuthorService', function($http) {
    var authorbooks = [];
    authorbooks.getResponses = function(authorId) {
        return $http({
            method: "GET",
            url: `https://cisco-backend-cryogenicplanet.c9users.io/showAuthor?uaid=${authorId}`, //Books is variable which is passed to the function. also you can pass it to that url it will be a different url with author id not the name  
            headers: { 'Content-Type': 'application/json' },
            // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) {
            console.log(responses.data.books);
            return responses.data.books;
        });
    }
    return authorbooks;
});

//Genre Service
app.service('showGenreService', function($http) {
    var genrebooks = [];
    genrebooks.getBooksGenre = function() {
        return $http({
            method: "GET",
            url: `###`, //Books is variable which is passed to the function. also you can pass it to that url it will be a different url with author id not the name  
            headers: { 'Content-Type': 'application/json' },
            // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) {
            return responses.data;
        });
    }
    return genrebooks;

});