var app = angular.module("quickbooks");
app.service('borrowedBooksService', function($http, userService) {
    var borrows = [];
    borrows.getBorrowedBooks = function() {
        return $http({
            method: "GET",
            url: `https://cisco-backend-cryogenicplanet.c9users.io/borrowedBooks`,
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() },
            // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) {
            console.log(responses.data.borrowbooks);
            return responses.data.borrowbooks;
        });
    }
    
    borrows.returnBorrowedBook = function (data) {
        { 
            return $http({ 
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() }, // Setting Headers, Function call to get getToken() to send to db
                data: JSON.stringify(data),
                cache: true,
                url: `https://cisco-backend-cryogenicplanet.c9users.io/returnbook` // Url
            }).then(function(responses) {
                console.log(responses.data.message);
                return responses.data.message;
            });
        }
    }
    
    borrows.getLentBooksStatus = function() {
        return $http({
            method: "GET",
            url: `https://cisco-backend-cryogenicplanet.c9users.io/lentBooks`,
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() },
            // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) {
            console.log(responses.data.lentbooks);
            return responses.data.lentbooks;
        });
    }
    
    borrows.takeBackBorrowedBook = function (data) { // NAME
        { 
            return $http({ 
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken() }, // Setting Headers, Function call to get getToken() to send to db
                data: JSON.stringify(data),
                cache: true,
                url: `https://cisco-backend-cryogenicplanet.c9users.io/takeBackBook` // Url
            }).then(function(responses) {
                console.log(responses.data.message);
                return responses.data.message;
            });
        }
    }

    return borrows;
});