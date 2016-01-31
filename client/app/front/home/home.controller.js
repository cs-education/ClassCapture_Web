'use strict';

angular.module('classCaptureApp')
  .controller('HomeCtrl', function ($scope, $rootScope, $state, authService, _) {

    authService.getLoggedInUser()
    .then(user => {
    	$scope.user = user;

        // if the target state is just front.home, must forward user to some other state since
        // this is supposed to be an abstract state
        if ($state.current.name === 'front.home') {
            if (_.isEmpty($scope.user.sections)) {
                // Go to the account page so user can register for some sections
                $state.go('front.home.account');
            } else {
                $state.go('front.home.calendar');
            }
        }
    })
    .catch(err => {
    	$state.go('front.login');
    });

  });
