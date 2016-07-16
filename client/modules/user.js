////////////////////////////////////////////////////////////
//// userProfileController
angular.module('user', ['ngRoute', 'ngCookies', 'login'])
.controller('userProfileController', function ($scope, $routeParams, loginFactory)
{
  $scope.getUserProfile = function() {
    loginFactory.getUserInfo($routeParams.id).then(function(data) {
        console.log(data);
        $scope.name = data.name;
        $scope.topic = data.numTopic;
        $scope.post = data.numPost;
        $scope.comment = data.numComment;
    }, function(reason) {
        console.log('user data fetch error', reason);
    });
  };
}); 