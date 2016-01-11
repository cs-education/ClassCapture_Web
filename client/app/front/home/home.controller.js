'use strict';

angular.module('classCaptureApp')
  .controller('HomeCtrl', function ($scope, $rootScope, $state, authService, _) {

    authService.getLoggedInUser()
    .then(user => {
    	$scope.user = user;

        if (_.isEmpty($scope.user.sections)) {
            // Go to the account page so user can register for some sections
            $state.go('front.home.account');
        } else {
            $state.go('front.home.calendar');
        }
    })
    .catch(err => {
    	$state.go('front.login');
    });

  });
