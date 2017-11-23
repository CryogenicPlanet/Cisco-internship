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