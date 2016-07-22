///////////////////////////////////////////////////////////////////////
//  Dashboard Controller
angular.module('dashboard', ['ngRoute', 'ngCookies', 'login', 'topic', 'user'])
  .directive('elastic', [
    '$timeout',
    function($timeout) {
      return {
        restrict: 'A',
        link: function($scope, element) {
          $scope.initialHeight = $scope.initialHeight || element[0].style.height;
          var resize = function() {
            element[0].style.height = $scope.initialHeight;
            element[0].style.height = "" + element[0].scrollHeight + "px";
          };
          element.on("input change", resize);
          $timeout(resize, 0);
        }
      };
    }
  ])
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
          $scope.topicName = "";
          $scope.imageURL = "";
          $scope.topicCategory = "";
          $scope.topicDescription = "";

          return topicFactory.getTopics();
        })
        .then(function(d) {
          $scope.topics = d;
          console.log($scope.topics);
        });
    };

    $scope.getTopics = function() {
      console.log("getTopics is called");
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