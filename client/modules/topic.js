///////////////////////////////////////////////////////////
/// topicFactory
angular.module('topic', ['ngRoute', 'ngCookies', 'login'])
    .factory('topicFactory', function($http, $q, $cookieStore) {
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

        factory.addTopic = function(topic, id, category, description) {
            return $q(function(resolve, reject) {
                var p;
                p = {topic: topic, id: id, category: category, description: description};
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

        factory.addPost = function(topicId, postContent, userId) {
            return $q(function(resolve, reject) {
                var p;
                p = {postContent: postContent, id: userId};
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
    })
    .controller('topicDetailController', function ($scope, $routeParams, topicFactory, loginFactory, $location)
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
            console.log('topicDetailController: input parameters:', $scope.topic._id, postContent, $scope.currentUser._id);
            topicFactory.addPost($scope.topic._id, postContent, $scope.currentUser._id)
                .then(function(data) {
                    // data contains posts
                    console.log('topicDetailController: response of addPost', data);
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
    });
