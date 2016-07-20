///////////////////////////////////////////////////////////////////////
//  Dashboard Controller
angular.module('dashboard', ['ngRoute', 'ngCookies', 'login', 'topic', 'user'])
  .controller('dashboardController', ['$scope', 'loginFactory', 'topicFactory', '$location', function($scope, loginFactory, topicFactory, $location) {
    $scope.getLoggedUser = function() {
      if(!loginFactory.getLoggedUser()) {
        $location.url('/login');
      } else return loginFactory.getLoggedUser();
    };

    $scope.addTopic = function() {
      topicFactory.addTopic($scope.topicName, $scope.imageURL, loginFactory.getLoggedUser(), $scope.topicCategory, $scope.topicDescription)
        .then(function(data) {
          console.log('topic added properly', data);
          return topicFactory.getTopics();
        })
        .then(function(d) {
          $scope.topics = d;
          console.log($scope.topics);
        });
    };

    $scope.getTopics = function() {
      // to fill select option menu for customers
      topicFactory.getTopics()
        .then(function(data) {
          $scope.topics = data;
          console.log($scope.topics);
        });
    };

    $scope.onSuccessImage = function(img) {
      $scope.imageURL = img.url;
      console.log('selected image = ', $scope.imageURL);
    }

    $scope.logOut = function() {
      loginFactory.logout();
      $location.url('/login');
    };
  }]);