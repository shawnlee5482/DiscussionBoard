

///////////////////////////////////////////////////////////////////
// loginFactory
angular.module('login', ['ngRoute', 'ngCookies'])
.factory('loginFactory', function($http, $cookies, $cookieStore, $q) {
    var factory = {};
    factory.loggedUser = null;

    factory.getLoggedUser = function() {
      // check if there is a cookie
      // if there set loggedUser as the cookie contents
      // if not return null
      var res = $cookieStore.get('currentUser');
      if(!res) return null;
      else return res;
    };

    factory.addUser = function(name) {
        return $q(function(resolve, reject) {
            console.log('http post requested name=', name);
            $http.post('/users', {name: name}).then(function(output) {
                    console.log('registered user info = ', output.data);
                    $cookieStore.put('currentUser', output.data);
                    resolve(output.data);  //output is the complete user list
                }, function(err) {
                    reject(err);
                }
            );
        });
      // should store at db
    };

    factory.logout = function(user) {
      factory.loggedUser = null; 
    };

    factory.getUserInfo = function(id) {
        return $q(function(resolve, reject) {
            console.log('getUserInfo', id);
            $http.get('/user/' + id).then(function (output) {
                console.log('factory.getUserInfo', output.data);
                resolve(output.data);
            }, function(reason) {
                reject(reason);
            });
        });
    };

    return factory;
})
.controller('loginController', function ($scope, loginFactory, $location)
{
  $scope.login = function() {
    loginFactory.addUser($scope.loginName).then(function(data) {
      // now move to dashboard
        console.log('user added = ', data);
      $location.url('/dashboard');          
    }, function(reason) {
      console.log('error in addidng user', reason);
      $scope.loginName = ""; // reset user name
    });

  };

  $scope.getLoggedUser = function() {
    return loginFactory.getLoggedUser();
  };
});  




