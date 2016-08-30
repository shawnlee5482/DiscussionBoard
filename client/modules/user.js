////////////////////////////////////////////////////////////
//// userProfileController
angular.module('user', ['ngRoute', 'ngCookies', 'login'])
.controller('userProfileController', ['$scope', '$routeParams' ,'loginFactory', function ($scope, $routeParams, loginFactory)
{
  $scope.getUserProfile = function() {
    loginFactory.getUserInfo($routeParams.id).then(function(data) {
        $scope.login = data.login;
        $scope.topic = data.numTopic;
        $scope.post = data.numPost;
        $scope.comment = data.numComment;
    }, function(reason) {
        // TODO: Better error handling; want to be able to notify user
        // console.logs do not do this; only good for debugging
    });
  };
}]);