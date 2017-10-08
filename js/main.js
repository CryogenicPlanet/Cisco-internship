var app = angular.module("quickbooks", ["ngRoute"]);
/*
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "homepage.html"
    });
  });
  */

app.controller('loginController', function($scope,$http) {
    $scope.login = function() {
           // alert("Inside Login Method");
            var url = "https://cisco-backend-cryogenicplanet.c9users.io/login";
            var data = {email: $scope.lEmail, pword: $scope.lPassword};
            console.log(data);
            //url = "/test.php";
            $http({
                method : "POST",
                 contentType: 'application/json',
                data : JSON.stringify(data),
                cache: true,
                url : url
            }).then(/*function mySuccess(response) {
                $scope.success = response.data;
              //  alert("Received: " +  $scope.success);
              console.log("Response" + response);
            }, function myError(response) {
                $scope.error = response.statusText;
               // alert("Received Error: " +  $scope.error);
                 console.log("Received Error" + $scope.success);
            } */
            function sucess(response){
                 if (!response.data.status){
      Materialize.toast('<p class="flow-text red-text">' + response.data.message +'</p>', 4000);
    } else {
      // Show the whole page
       Materialize.toast('<p class="flow-text white-text">' + response.data.message + '</p>', 2000);
      
    }
            });
        }
});