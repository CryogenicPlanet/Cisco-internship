var app = angular.module("quickbooks");
app.service('profileService', function($http){
    var profileService = []
    profileService.getDetails = function(userID, token) { // This is function to get your details
    console.log(userID);
        return $http({ // Returning the function of http to previous function getDetails()
            method: "GET", // Type GET
            url: `https://cisco-backend-cryogenicplanet.c9users.io/userDetails`, // Url
            headers: { 'Content-Type': 'application/json', 'x-access-token': token, 'x-user-id' : userID }, // Setting Headers, Function call to get getToken() to send to db
        }).then(function(responses) { // Promise sucessful
          /*  let username = responses.data.response.name; //Username
            let uuid = responses.data.response.uuid; // UUID
            var usersBooks = JSON.stringify(responses.data.response.books); // Making it JSON
            var followers = JSON.stringify(responses.data.response.followers); // Making it JSON
            var following = JSON.stringify(responses.data.response.following); // Making it JSON
            sessionStorage.setItem("books", usersBooks); // SessionStorage slightly different from Local storage this is stored only for that session like till you close tab or a few mins longer than that
            sessionStorage.setItem("followers", followers);
            sessionStorage.setItem("following", following); */
            return responses.data;
        });
    }
    return profileService;
});
    