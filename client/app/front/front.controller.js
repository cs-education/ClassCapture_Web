'use strict';

angular.module('classCaptureApp')
  .controller('FrontCtrl', function ($scope, $http, $state) {
  	// Load in the video chooser to the view
  	$state.go('front.videoChooser');
  });
