'use strict';

angular.module('classCaptureApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, $q, authService, _) {
    $scope.isFunction = _.isFunction;

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });