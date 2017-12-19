var app = angular.module("quickbooks");
app.service('searchService', function($http) {
    var searchService = [];
    searchService.finalSearch = function(toSearch) {
        { // Function to get New Books
            return $http({
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