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
      if (!loginFactory.getLoggedUser()) {
        $location.url('/login');
      } else {
        return loginFactory.getLoggedUser();
      }
    };

    $scope.addTopic = function() {
      // When you're passing this many arguments, it's best practice to change it as only an object
      topicFactory.addTopic($scope.topicName, $scope.imageURL, loginFactory.getLoggedUser(), $scope.topicCategory, $scope.topicDescription)
        .then(function(data) {
          $scope.topicName = '';
          $scope.imageURL = '';
          $scope.topicCategory = '';
          $scope.topicDescription = '';

          return topicFactory.getTopics();
        })
        .then(function(d) {
          $scope.topics = d;
        })
        .catch(function(err) {
          // TODO: ERR HANDLING
        })
    };

    $scope.getTopics = function() {
      // to fill select option menu for customers
      topicFactory.getTopics()
        .then(function(data) {
          $scope.topics = data;
        })
        .catch(function(err) {
          // TODO: ERR HANDLING
        });
    };

    $scope.onSuccessImage = function(img) {
      $scope.imageURL = img.url;
    }

    $scope.logOut = function() {
      loginFactory.logout();
      $location.url('/login');
    };
  }]);