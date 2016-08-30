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
              // TODO: $HTTP GET ALREADY RETURNS A PROMISE; Using $q to create a new Promise is redundant 
              // e.g., return $http.get('/post/' + id + '/up');
              $http.get('/post/' + id + '/up').then(function (output) {
                resolve(output.data);  //output is the topic list fetched from db
              }, function(reason) {
                reject(reason);
              });
          });
      };

      factory.down = function(id) {
          return $q(function(resolve, reject) {
              // TODO: $HTTP GET ALREADY RETURNS A PROMISE; Using $q to create a new Promise is redundant 
              $http.get('/post/' + id + '/down').then(function (output) {
                resolve(output.data);  //output is the topic list fetched from db
              }, function(reason) {
                reject(reason);
              });
          });
      };

      factory.getTopics = function() {
          var token = $cookieStore.get('mytoken');
          if (token) {
            $http.defaults.headers.common['x-access-token'] = token;
          }

          return $q(function(resolve, reject) {
               // TODO: $HTTP GET ALREADY RETURNS A PROMISE; Using $q to create a new Promise is redundant
              $http.get('/topics').then(function(output) {
                resolve(output.data);  //output is the topic list fetched from db
              }, function(reason) {
                reject(reason);
              });
          })
      };

      factory.getTopicDetails = function(id) {
          // HINT: You can use an Angular HTTP interceptor for this actually
          $http.defaults.headers.common['x-access-token'] = $cookieStore.get('mytoken');
          return $q(function(resolve, reject) {
              // TODO: $HTTP GET ALREADY RETURNS A PROMISE; Using $q to create a new Promise is redundant 
              $http.get('/topic/' + id).then(function(output) {
                  resolve(output.data);
              }, function(reason) {
                  reject(reason);
              });
          });

      };

      factory.addTopic = function(topic, imageURL, id, category, description) {
          return $q(function(resolve, reject) {
              var p = { 
                topic: topic, 
                imageURL: imageURL, 
                id: id, 
                category: category, 
                description: description,
                date: (new Date()).getTime()
              };

                // TODO: $HTTP POST ALREADY RETURNS A PROMISE; Using $q to create a new Promise is redundant 
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
              var p = {login: login};

                // TODO: $HTTP POST ALREADY RETURNS A PROMISE; Using $q to create a new Promise is redundant 
              $http.post('/users', p).then(function(output) {
                resolve(output.data);  //output is the complete user list
              }, function(reason) {
                reject(reason);
              });
          });
      };

      factory.addPost = function(topicId, postContent, imageURL, userId) {
          return $q(function(resolve, reject) {
              var p = {
                postContent: postContent, 
                imageURL: imageURL, 
                id: userId
              };

              // $HTTP.POST already returns a promise; $q promise wrapper is not needed
              $http.post('/topic/' + topicId, p).then(function(output) {
                  resolve(output.data);  //output is the complete user list
              }, function(reason) {
                  reject(reason);
              });
          });

      };

      factory.addComment = function(topicId, postId, userId, comment) {
          return $q(function(resolve, reject) {
              var p = {
                topicId: topicId, 
                userId: userId, 
                comment: comment
              };

              // $HTTP.POST already returns a promise; $q promise wrapper is not needed
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
  .controller('topicDetailController', ['$scope', '$location', '$routeParams', 'topicFactory', 'loginFactory', 
    function($scope, $location, $routeParams, topicFactory, loginFactory) {
      $scope.up = function(post) {
          topicFactory.up(post._id)
            .then(function(data) {
              post.upCount = data.upCount;
            })
            .catch(function(err) {
              // TODO: better error handling; notify the user
            });
      };

      $scope.down = function(post) {
          topicFactory.down(post._id)
            .then(function(data) {
                post.downCount = data.downCount;
            })
            .catch(function(err) {
               // TODO: better error handling; notify the user
            });
      };

      $scope.addPost = function(postContent) {
        topicFactory.addPost($scope.topic._id, postContent, $scope.newPostImageURL, $scope.currentUser._id)
          .then(function(data) {
              $scope.newPostImageURL = "";
              $scope.post = "";
              return topicFactory.getTopicDetails($scope.topic._id);
          })
          .then(function(data) {
            $scope.topic = data;
          })
          .catch(function(err) {
            // TODO: better error handling
          });
      };

      $scope.getTopicDetails = function() {
        $scope.currentUser = loginFactory.getLoggedUser();  // here we set current user

        if (!$scope.currentUser) {
          $location.url('/login');
          return;
        }

        topicFactory.getTopicDetails($routeParams.id)
          .then(
            function(data) {
              $scope.topic = data;
            },
            function(reason) {
               // TODO: Better error handling
            }
          );
      };

      $scope.addComment = function(post, comment) {
        topicFactory.addComment($scope.topic._id, post._id, $scope.currentUser._id, comment)
          .then(function(data) {
            return topicFactory.getTopicDetails($routeParams.id);
          })
          .then(function(data) {
            $scope.topic = data;
          })
          .catch(function(err) {
            // TODO: Err handling
          });
      };

      $scope.onPostSuccessImage = function(image) {
        $scope.newPostImageURL = image.url;
      };

      $scope.BackToDashboard = function(image) {
        $location.url('/dashboard');
      }
  }]);
