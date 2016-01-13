'use strict';

angular.module('classCaptureApp')
	.controller('ConfirmPasswordModalCtrl', ($scope, MIN_PASSWORD_LENGTH) => {
		$scope.MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH;

		$scope.input = {
			info: {
				password: ''
			}
		};

		$scope.submit = () => {
			$scope.$close($scope.input.info.password);
		};

		$scope.cancel = () => {
			$scope.$dismiss('cancel');
		};
	});