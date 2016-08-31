'use strict';

///////////////////////////////////////////////////////////////////
// loginFactory
// Angular core libraries should be injected first; then third-party
angular.module('login', ['ngRoute', 'ngCookies'])
  .factory('loginFactory', ['$http', '$q', '$cookies', '$cookieStore', function($http, $q, $cookies, $cookieStore) {
    var factory = {};
    factory.loggedUser = null;

    factory.getLoggedUser = function() {
      // check if there is a cookie
      // if there set loggedUser as the cookie contents
      // if not return undefined
      return $cookieStore.get('currentUser');
    };

    factory.login = function(loginName, password) {
      return $q(function(resolve, reject) {
        // $HTTP.POST ALREADY RETURNS A PROMISE; You do not need to create a wrapper promise using $q
        $http.post('/login', {
            login: loginName,
            password: password
          })
          .then(function(output) {
            if (output.data.success) {
              $cookieStore.put('currentUser', output.data.userinfo);
              $cookieStore.put('mytoken', output.data.token);
              if (output.data.token) {
                $http.defaults.headers.common['x-access-token'] = output.data.token;
              }
              resolve(output.data.userinfo); //output is the complete user list
            } else {
              reject(output.data);
            }
          }, function(err) {
            reject(err);
          });
      });
      // should store at db
    };

    factory.signup = function(loginName, password) {
      return $q(function(resolve, reject) {
        // $HTTP.POST ALREADY RETURNS A PROMISE; You do not need to create a wrapper promise using $q
        $http.post('/users', {
          login: loginName,
          password: password
        }).then(function(output) {
          resolve(output);
        }, function(reason) {
          reject(reason);
        });
      });
      // should store at db
    };

    factory.checkDuplicate = function(loginName) {
      return $q(function(resolve, reject) {
        // $HTTP.POST ALREADY RETURNS A PROMISE; You do not need to create a wrapper promise using $q
        $http.post('/users/check_duplicate', {
          login: loginName
        }).then(function(output) {
          resolve(output);
        }, function(reason) {
          reject(reason);
        });
      });
      // should store at db
    };

    factory.logout = function() {
      factory.loggedUser = null;
      $cookieStore.remove('mytoken');
    };

    factory.getUserInfo = function(id) {
      return $q(function(resolve, reject) {
        // $HTTP.GET ALREADY RETURNS A PROMISE; You do not need to create a wrapper promise using $q
        $http.get('/user/' + id).then(function(output) {
          console.log('factory.getUserInfo', output.data);
          resolve(output.data);
        }, function(reason) {
          reject(reason);
        });
      });
    };

    return factory;
  }])
  .controller('loginController', ['$scope', '$location', 'loginFactory', function($scope, $location, loginFactory) {
    $scope.login = function() {
      loginFactory.login($scope.loginName, $scope.password)
        .then(function(data) {
          $location.url('/dashboard');
        }, function(reason) {
          console.log('error in addidng user', reason);
          $scope.loginName = ""; // reset loginName
        });
    };

    $scope.getLoggedUser = function() {
      return loginFactory.getLoggedUser();
    };
  }])
  .controller('signupController', ['$scope', '$location', 'loginFactory', function($scope, $location, loginFactory) {
    $scope.signup = function() {
      // we have loginName, password1, password2

      loginFactory.signup($scope.loginName, $scope.password1)
        .then(function(result) {
          if (result.data.success) {
            $location.url('/login');
          }
        }, function(reason) {
          // error occured during registration
          // TODO: Better error handling
          console.log(reason);
        });
    };

    $scope.loginChange = function() {
      $scope.bDuplicateChecked = false;
    };

    $scope.passwordChange = function() {
      $scope.bCheckedPassword = false;
    };
    $scope.bDuplicatedLogin = false;
    $scope.bDuplicateChecked = false;

    // duplication check
    $scope.checkDuplicate = function() {

      loginFactory.checkDuplicate($scope.loginName)
        .then(function(result) {
          $scope.bDuplicateChecked = true;
          if (result.data.success) {
            $scope.bDuplicatedLogin = false;
          } else {
            $scope.bDuplicatedLogin = true;
          }
          return $scope.bDuplicatedLogin;
        }, function(reason) {
          // TODO: Better error handling
          console.log(reason);
          return false;
        });
    };
  }]);