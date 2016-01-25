'use strict';

angular.module('classCaptureApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('front', {
        url: '/front',
        templateUrl: 'app/front/front.html',
        controller: 'FrontCtrl',
        abstract: true
      })

      .state('front.login', {
        url: '/login?tab',
        templateUrl: 'app/front/login/login.html',
        controller: 'LoginCtrl',
        data: {
          showHeader: true
        }
      })

      .state('front.logout', {
        url: '/logout',
        controller: function ($state, authService) {
          authService.logoutCurrentUser()
          .then(() => {
            $state.go('^.login');
          });
        }
      })

      .state('front.home', {
        url: '/home',
        templateUrl: 'app/front/home/home.html',
        controller: 'HomeCtrl',
        data: {
          showHeader: false
        }
      })

      .state('front.home.account', {
        url: '/account',
        templateUrl: 'app/front/home/account/account.html',
        controller: 'AccountCtrl'
      })

      .state('front.home.calendar', {
        url: '/calendar',
        templateUrl: 'app/front/home/calendar/calendar.html',
        controller: 'CalendarCtrl'
      })

      .state('front.videoChooser', {
      	url: '/videoChooser/:sectionID?start&end',
      	templateUrl: 'app/front/videoChooser/videoChooser.html',
      	controller: 'VideoChooserCtrl',
        data: {
          showHeader: false,
          needsFullWidth: true
        }
      })

      .state('front.notFound', {
        url: '^/notFound', // no need to prefix his with /front/notFound
        templateUrl: 'app/front/notFound/notFound.html',
        controller: 'NotFoundCtrl',
        data: {
          showHeader: false
        }
      })

      .state('front.createCourse', {
        url: '/createCourse',
        templateUrl: 'app/front/createCourse/createCourse.html',
        controller: 'CreateCourseCtrl',
        data: {
          showHeader: false
        }
      });
  });