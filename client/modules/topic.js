///////////////////////////////////////////////////////////
/// topicFactory
angular.module('topic', ['ngRoute', 'ngCookies', 'login', 'angular-filepicker'])
  .config(['filepickerProvider', function (filepickerProvider) {
      filepickerProvider.setKey('AyVB1bqQpm50F0VaUGUgsz');
  }])
  .factory('topicFactory', ['$http', '$q', '$cookieStore', function($http, $q, $cookieStore) {
      var factory = [];

      factory.up = function(id) {
          return $q(function(resolve, reject) {
              $http.get('/post/' + id + '/up').then(function (output) {
                  console.log('topicFactory after factory.up', output.data);
                  resolve(output.data);  //output is the topic list fetched from db
              }, function(reason) {
                  reject(reason);
              });
          });
      };

      factory.down = function(id) {
          return $q(function(resolve, reject) {
              $http.get('/post/' + id + '/down').then(function (output) {
                  console.log('topicFactory after factory.down', output.data);
                  resolve(output.data);  //output is the topic list fetched from db
              }, function(reason) {
                  reject(reason);
              });
          });
      };

      factory.getTopics = function() {
          var token = $cookieStore.get('mytoken');
          console.log('token = ', token);
          if (token) {
              $http.defaults.headers.common['x-access-token'] = token;
          }

          return $q(function(resolve, reject) {
              $http.get('/topics').then(function(output) {
                  console.log('topicFactory', output.data);
                  resolve(output.data);  //output is the topic list fetched from db
              }, function(reason) {
                  reject(reason);
              });
          })
      };

      factory.getTopicDetails = function(id) {
          $http.defaults.headers.common['x-access-token'] = $cookieStore.get('mytoken');
          return $q(function(resolve, reject) {
              $http.get('/topic/' + id).then(function(output) {
                  console.log('topicFactory: getTopicDetails = ', output.data);
                  resolve(output.data);
              }, function(reason) {
                  reject(reason);
              });
          });

      };

      factory.addTopic = function(topic, imageURL, id, category, description) {
          return $q(function(resolve, reject) {
              var p;
              p = {topic: topic, imageURL: imageURL, id: id, category: category, description: description};
              p.date = (new Date()).getTime();
              $http.post('/topics', p).then(function(output) {
                  resolve(output.data);  //output is the complete user list
              }, function(reason) {
                  reject(reason);
              });
          });
      };

      factory.addUser = function(login) {
          return $q(function(resolve, reject) {
              // should store at db
              var p;
              p = {login: login};
              $http.post('/users', p).then(function(output) {
                  resolve(output.data);  //output is the complete user list
              }, function(reason) {
                  reject(reason);
              });
          });
      };

      factory.addPost = function(topicId, postContent, imageURL, userId) {
          return $q(function(resolve, reject) {
              var p;
              p = {postContent: postContent, imageURL: imageURL, id: userId};
              $http.post('/topic/' + topicId, p).then(function(output) {
                  resolve(output.data);  //output is the complete user list
              }, function(reason) {
                  reject(reason);
              });
          });

      };

      factory.addComment = function(topicId, postId, userId, comment) {
          return $q(function(resolve, reject) {
              var p;
              p = {topicId: topicId, userId: userId, comment: comment};
              $http.post('/post/' + postId, p).then(function(output) {
                  resolve(output);  //output is the complete user list
              }, function(reason) {
                  reject(reason);
              });
          });

      };
      return factory;
  }])
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
  .controller('topicDetailController', ['$scope', '$routeParams', 'topicFactory', 'loginFactory', '$location', function($scope, $routeParams, topicFactory, loginFactory, $location)
  {
      $scope.up = function(post) {
          topicFactory.up(post._id).then(function(data) {
              console.log('topicFactory.up data=', data.upCount);
              post.upCount = data.upCount;
          }, function(reason) {
              console.log('topicFactory.up error in updating', reason);
          });
      };

      $scope.down = function(post) {
          topicFactory.down(post._id).then(function(data) {
              console.log('topicFactory.down data=', data.downCount);
              post.downCount = data.downCount;
          }, function(reason) {
              console.log('topicFactory.down error in updating', reason);
          });
      };

      $scope.addPost = function(postContent) {
          console.log('topicDetailController: input parameters:', $scope.topic._id, postContent, $scope.newPostImageURL, $scope.currentUser._id);
          topicFactory.addPost($scope.topic._id, postContent, $scope.newPostImageURL, $scope.currentUser._id)
            .then(function(data) {
                // data contains posts
                console.log('topicDetailController: response of addPost', data);
                $scope.newPostImageURL = "";
                $scope.post = "";
                return topicFactory.getTopicDetails($scope.topic._id);
            })
            .then(function(data) {
                  console.log('topicDetailController: data=', data);
                  $scope.topic = data;
              }
            );
      };

      $scope.getTopicDetails = function() {
          $scope.currentUser = loginFactory.getLoggedUser();  // here we set current user
          if(!$scope.currentUser) {
              $location.url('/login');
              return;
          }

          console.log('getTopicDetails:', $routeParams.id);
          topicFactory.getTopicDetails($routeParams.id)
            .then(
              function(data) {
                  console.log('topicDetailController: data=', data);
                  $scope.topic = data;
                  console.log('getTopicDetails: data.description', $scope.topic);
              },
              function(reason) {
                  console.log('topicDetailController error: ', reason);
              }
            );
      };

      $scope.addComment = function(post, comment) {
          console.log('topicDetailController-addComment-before Factory addPost', $scope.topic._id, post._id, $scope.currentUser._id, comment);
          topicFactory.addComment($scope.topic._id, post._id, $scope.currentUser._id, comment)
            .then(function(data) {
                console.log('addComment response from server', data);
                return topicFactory.getTopicDetails($routeParams.id);
            })
            .then(function(data) {
                console.log('topicDetailController: data=', data);
                $scope.topic = data;
            });
      };

      $scope.onPostSuccessImage = function(image) {
          $scope.newPostImageURL = image.url;
          console.log('selected image = ', image.url);
      };

      $scope.BackToDashboard = function(image) {
          $location.url('/dashboard');
      }
  }]);
