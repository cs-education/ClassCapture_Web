'use strict';

angular.module('classCaptureApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'classViewApp'
])
  .config(function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/front');

    $locationProvider.html5Mode(true);
  });