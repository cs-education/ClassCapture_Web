'use strict';

angular.module('classCaptureApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'base64',
  'classViewApp'
])
  .config(function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/notFound');

    $locationProvider.html5Mode(true);
  });