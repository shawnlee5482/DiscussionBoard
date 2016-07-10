///////////////////////////////////////////////////////////////////
// loginFactory
angular.module('login', ['ngRoute', 'ngCookies'])
.factory('loginFactory', function($http, $cookies, $cookieStore) {
    var factory = {};
    factory.loggedUser = null;

    factory.getLoggedUser = function() {
      // check if there is a cookie
      // if there set loggedUser as the cookie contents
      // if not return null
      var res = $cookieStore.get('currentUser');
      if(!res) return null;
      else return res;
    }

    factory.addUser = function(name, callback) {
      // should store at db
      $http.post('/users', {name: name}).success(function(output) {
          console.log('registered user info = ', output);             
          //factory.loggedUser = output;
          // set it to cookie
//              $cookies.put('currentUser', JSON.stringify(output));
          $cookieStore.put('currentUser', output);
          callback(output);  //output is the complete user list
      });
    }

    factory.logout = function(user, callback) {
      factory.loggedUser = null; 
    };

    factory.getUserInfo = function(id, callback) {
        console.log('getUserInfo', id);
        $http.get('/user/'+ id).success(function(output) {
            console.log('factory.getUserInfo', output);
            callback(output);
        });
    }

    return factory;
})
.controller('loginController', function ($scope, loginFactory, $location)
{
  $scope.login = function() {
    loginFactory.addUser($scope.loginName, function(data) {
      // now move to dashboard  
      $location.url('/dashboard');          
    });

  };

  $scope.getLoggedUser = function() {
    return loginFactory.getLoggedUser();
  };
});  




