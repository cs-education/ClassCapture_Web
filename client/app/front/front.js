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
      	url: '/videoChooser/:courseHash?start&end',
      	templateUrl: 'app/front/videoChooser/videoChooser.html',
      	controller: 'VideoChooserCtrl'
      })

      .state('front.notFound', {
        url: '^/notFound', // no need to prefix his with /front/notFound
        templateUrl: 'app/front/notFound/notFound.html',
        controller: 'NotFoundCtrl'
      })

      .state('front.createCourse', {
        url: '/createCourse',
        templateUrl: 'app/front/createCourse/createCourse.html',
        controller: 'CreateCourseCtrl'
      });
  });