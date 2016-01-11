'use strict';

angular.module('classCaptureApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'base64',
  'classViewApp',
  'ui.calendar'
])
  .config(function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.when('/front', '/front/login/');
    $urlRouterProvider.when('/', '/front/login/');
    $urlRouterProvider
      .otherwise('/notFound');

    $locationProvider.html5Mode(true);
  });