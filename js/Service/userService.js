var app = angular.module("quickbooks");
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
            headers: { 'Content-Type': 'application/json', 'x-access-token': userService.getToken(),'x-user-id' : -1 }, // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) { // Promise sucessful
            username = responses.data.response.name; //Username
            let uuid = responses.data.response.uuid; // UUID
            localStorage.setItem("uuid",uuid);
            localStorage.setItem("username", username);
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
    userService.getUsername = () => { return localStorage.getItem("username"); };
    userService.getUuid = () => { return localStorage.getItem("uuid"); };
    userService.getToken = () => { return localStorage.getItem("token"); }; // Function returns of token of the user
    return userService;
});
