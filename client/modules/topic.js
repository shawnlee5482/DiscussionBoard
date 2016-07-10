///////////////////////////////////////////////////////////
/// topicFactory
angular.module('topic', ['ngRoute', 'ngCookies', 'login'])
.factory('topicFactory', function($http) {
    var factory = [];

    factory.up = function(id, callback) {
      $http.get('/post/' + id + '/up').success(function(output) {
          console.log('topicFactory after factory.up', output);
          callback(output);  //output is the topic list fetched from db
      });          
    };

    factory.down = function(id, callback) {
      $http.get('/post/' + id + '/down').success(function(output) {
          console.log('topicFactory after factory.down', output);
          callback(output);  //output is the topic list fetched from db
      });          
    };

    factory.getTopics = function(callback) {
      $http.get('/topics').success(function(output) {
          console.log('topicFactory', output);
          callback(output);  //output is the topic list fetched from db
      });          
    };

    factory.getTopicDetails = function(id, callback) {
      $http.get('/topic/' + id).success(function(output) {
          console.log('topicFactory: getTopicDetails = ', output);            
          callback(output);
      });
    }

    factory.addTopic = function(topic, id, category, description, callback) {
        var p = {topic:topic, id:id, category:category, description:description};
        p.date = (new Date()).getTime();
        $http.post('/topics', p).success(function(output) {
            callback(output);  //output is the complete user list
        });
    };

    factory.addUser = function(name, callback) {
      // should store at db
        var p = {name:name};
        $http.post('/users', p).success(function(output) {
            callback(output);  //output is the complete user list
        });
    };

    factory.addPost = function(topicId, postContent, userId, callback) {
        var p = {postContent:postContent, id:userId};
        $http.post('/topic/' + topicId, p).success(function(output) {
            callback(output);  //output is the complete user list
        });            
    };

    factory.addComment = function(topicId, postId, userId, comment, callback) {
        var p = {topicId:topicId, userId: userId, comment:comment};
        $http.post('/post/' + postId, p).success(function(output) {
            callback(output);  //output is the complete user list
        });            
    };        
    return factory;
})
.controller('topicDetailController', function ($scope, $routeParams, topicFactory, loginFactory, $location)
{
  $scope.up = function(post) {
     topicFactory.up(post._id, function(data) {
        console.log('topicFactory.up data=', data.upCount);
        post.upCount = data.upCount;
     });        
  };

  $scope.down = function(post) {
     topicFactory.down(post._id, function(data) {
         console.log('topicFactory.down data=', data.downCount);
         post.downCount = data.downCount;
     });  
  };

  $scope.addPost = function(postContent) {
    console.log('topiccccc', $scope.topic)
    console.log('topicDeatailController: input parameters:', $scope.topic._id, postContent, $scope.currentUser._id);
    topicFactory.addPost($scope.topic._id, postContent, $scope.currentUser._id, function(data) {
      // data contains posts
      console.log('topicDetailController: response of addPost', data);
      topicFactory.getTopicDetails($scope.topic._id, function(data) {
          console.log('topicDetailController: data=', data);
          $scope.topic = data;
      });          
    });
  };

  $scope.getTopicDetails = function() {
    $scope.currentUser = loginFactory.getLoggedUser();  // here we set current user
    if(!$scope.currentUser) {
      $location.url('/login');
      return;
    }

    console.log('getTopicDetails:', $routeParams.id);
    topicFactory.getTopicDetails($routeParams.id, function(data) {
        console.log('topicDetailController: data=', data);
        $scope.topic = data;
        console.log('getTopicDetails: data.description', $scope.topic);
    });
  };

  $scope.addComment = function(post, comment) {
    console.log('topicDetailController-addComment-before Factory addPost', $scope.topic._id, post._id, $scope.currentUser._id, comment);
    topicFactory.addComment($scope.topic._id, post._id, $scope.currentUser._id, comment, function(data) {
        console.log('addComment response from server', data);
        topicFactory.getTopicDetails($routeParams.id, function(data) {
            console.log('topicDetailController: data=', data);
            $scope.topic = data;
        });            
    });
  };

}); 
