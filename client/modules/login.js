

///////////////////////////////////////////////////////////////////
// loginFactory
angular.module('login', ['ngRoute', 'ngCookies'])
.factory('loginFactory', ['$http', '$cookies', '$cookieStore', '$q', function($http, $cookies, $cookieStore, $q) {
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

    factory.login = function(loginName, password) {
        return $q(function(resolve, reject) {
            console.log('http post requested loginName=', loginName, 'password = ', password);
            $http.post('/login', {login: loginName, password:password}).then(function(output) {
              if(output.data.success) {
                  console.log('received token = ', output.data.token);
                  $cookieStore.put('currentUser', output.data.userinfo);
                  $cookieStore.put('mytoken', output.data.token);
                  if (output.data.token) {
                    $http.defaults.headers.common['x-access-token'] = output.data.token;
                  }
                  resolve(output.data.userinfo);  //output is the complete user list
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
        console.log('http post requested loginName=', loginName, 'password = ', password);
        $http.post('/users', {login: loginName, password:password}).then(function(output) {
          resolve(output);
        }, function(reason) {
          reject(reason);
        });
      });
      // should store at db
    };

    factory.checkDuplicate = function(loginName) {
      return $q(function(resolve, reject) {
        console.log('checkDuplicate loginName=', loginName);
        $http.post('/users/check_duplicate', {login: loginName}).then(function(output) {
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
}])
.controller('loginController', ['$scope', 'loginFactory', '$location', function ($scope, loginFactory, $location)
{
  $scope.login = function() {
    loginFactory.login($scope.loginName, $scope.password).then(function(data) {
      // now move to dashboard
        console.log('user added = ', data);

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
.controller('signupController', ['$scope', 'loginFactory', '$location', function($scope, loginFactory, $location) {
  $scope.signup = function() {
    // we have loginName, password1, password2

    loginFactory.signup($scope.loginName, $scope.password1).then(function (result) {
      if (result.data.success) {
        $location.url('/login');
      } else {
        console.log(result.message)
      }

    }, function (reason) {
      // error occured during registration
      console.log(reason);
    });
  };

  $scope.loginChange = function() {$scope.bChecked = false; console.log('login Name changed')};
  $scope.passwordChange = function() {$scope.bCheckedPassword = false; console.log('passwordchanged')};

  // duplication check
  $scope.checkDuplicate = function() {
    console.log('checkDuplicate is called', $scope.loginName);
    $scope.bDuplicatedLogin = true;
    $scope.bChecked = true;
    loginFactory.checkDuplicate($scope.loginName).then(function(result) {
      if(result.data.success) {
        console.log('login name is available');
        $scope.bDuplicatedLogin = false;
      } else {
        console.log('Login name is in use. Select another name!');
        $scope.bDuplicatedLogin = true;
      }
    }, function(reason) {
      console.log(reason);
      return false;
    });
    return $scope.bDuplicatedLogin;
  };
}]);




