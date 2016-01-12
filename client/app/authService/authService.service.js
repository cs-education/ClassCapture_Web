'use strict';

angular.module('classCaptureApp')
  .factory('authService', function (User, $q, $rootScope, _) {
    return {
      login: function ({email, password}) {
        return User.login({email, password}).$promise
        .then(user => {
          $rootScope['user'] = user;
          return user;
        });
      },

      register: function({firstName, lastName, email, password}) {
        return User.register({
          firstName,
          lastName,
          email,
          password
        })
        .$promise
        .then(user => {
          $rootScope['user'] = user;
          return user;
        });
      },

      getLoggedInUser: function () {
        if (!_.isUndefined($rootScope.user)) {
          var deferred = $q.defer();
          deferred.resolve($rootScope.user);
          return deferred.promise;
        } else {
          return User.me().$promise
          .then(user => {
            $rootScope['user'] = user;
          });
        }
      },

      logoutCurrentUser: function () {
        if ($rootScope.user) {
          delete $rootScope['user'];
        }

        return User.logout().$promise;
      },

      isLoggedIn: function () {
        return _.has($rootScope, 'user');
      },

      updateUserInfo: function (userInfo) {
        return User.save({id: userInfo.id}, userInfo).$promise
        .then(user => {
          $rootScope['user'] = user;
        });
      }
    };
  });
