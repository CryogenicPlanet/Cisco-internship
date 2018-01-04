var app = angular.module("quickbooks");
app.service('featuredBooksService', function($http, userService) {
    var featured = [];
    featured.getBooks = function(userID) {
        return $http({
            method: "GET",
            url: `https://cisco-backend-cryogenicplanet.c9users.io/featuredBooks`,
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken(),'x-user-id' : userID},
            // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) {
            console.log(responses.data.books);
            return responses.data.books;
        });
    }
    
    featured.addFeaturedBooks = function(data) {
        { 
            return $http({ 
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() }, // Setting Headers, Function call to get getToken() to send to db
                data: JSON.stringify(data),
                cache: true,
                url: `https://cisco-backend-cryogenicplanet.c9users.io/addFeaturedBooks` // Url
            }).then(function(responses) {
                console.log(responses.data.message);
                return responses.data.message;
            });
        }
    }
    
    featured.removeFeaturedBooks = function(data) {
        { 
            return $http({ 
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() }, // Setting Headers, Function call to get getToken() to send to db
                data: JSON.stringify(data),
                cache: true,
                url: `https://cisco-backend-cryogenicplanet.c9users.io/removeFeaturedBooks` // Url
            }).then(function(responses) {
                console.log(responses.data.message);
                return responses.data.message;
            });
        }
    }
    
    return featured;
});