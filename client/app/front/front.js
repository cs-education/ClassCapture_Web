'use strict';

angular.module('classCaptureApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('front', {
        url: '/front',
        templateUrl: 'app/front/front.html',
        controller: 'FrontCtrl'
      })

      .state('front.videoChooser', {
      	url: '/videoChooser?start&end',
      	templateUrl: 'app/front/videoChooser/videoChooser.html',
      	controller: 'VideoChooserCtrl'
      });
  });