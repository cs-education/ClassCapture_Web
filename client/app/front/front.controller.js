'use strict';

angular.module('classCaptureApp')
  .controller('FrontCtrl', function ($scope, $http, $state, $rootScope, authService) {
  	$scope.title = null;
  	$scope.$state = $state;

    $scope.menu = [
      {
        'title': 'Home',
        'link': '/front',
        'if': _.negate(authService.isLoggedIn)
      },
    	{
      	'title': 'Account',
      	'link': '/front/home/account',
        'if': authService.isLoggedIn
    	},
    	{
      	'title': 'Calendar',
      	'link': '/front/home/calendar',
        'if': authService.isLoggedIn
    	},
      {
        'title': () => authService.isLoggedIn() ? 'Logout' : 'Login',
        'link': () => authService.isLoggedIn() ? '/front/logout' : '/front/login',
        'if': true
      }
    ];

    $scope.setMenu = menu => $scope.menu = menu;

  	authService.getLoggedInUser()
  	.then(user => {
  		$scope.user = user;
  	})
  	.catch(err => {
  		$state.go('front.login');
  	});
  });
