///////////////////////////////////////////////////////////////////////
//  Dashboard Controller
angular.module('dashboard', ['ngRoute', 'ngCookies', 'login', 'topic', 'user'])
.controller('dashboardController', function($scope, loginFactory, topicFactory, $location) {

  $scope.getLoggedUser = function() {
    if(!loginFactory.getLoggedUser()) {
      $location.url('/login');
    } else return loginFactory.getLoggedUser();
  };

  $scope.addTopic = function() {
      topicFactory.addTopic($scope.topicName, loginFactory.getLoggedUser(), $scope.topicCategory, 
        $scope.topicDescription, function(data) {
        topicFactory.getTopics(function(d) {
          $scope.topics = d;
          console.log($scope.topics);
        }); 
      });
  };

  $scope.getTopics = function() {
      // to fill select option menu for customers
      topicFactory.getTopics(function(data) {
          $scope.topics = data;
          console.log($scope.topics);              
      });                     
  }   
});