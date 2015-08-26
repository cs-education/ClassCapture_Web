angular.module("classCaptureApp")
	.controller("VideoChooserCtrl", ["$scope", "MediaPlayer", function ($scope, MediaPlayer) {
		// angular bootstrap docs: https://angular-ui.github.io/bootstrap/
		$scope.chosenDate = new Date();
		
		$scope.startTime = new Date();
		$scope.endTime   = new Date();
		$scope.endTime.setHours($scope.endTime.getHours() + 1);

		// Make sure startTime never goes over endTime
		$scope.$watch('startTime', (newStartTime, oldStartTime) => {
			$scope.startTime = newStartTime >= $scope.endTime ? oldStartTime : newStartTime;
		});

		// Make sure endTime never goes below startTime
		$scope.$watch('endTime', (newEndTime, oldEndTime) => {
			$scope.endTime = newEndTime <= $scope.startTime ? oldEndTime : newEndTime;
		});

		$scope.mediaPlayer = new MediaPlayer();
	}]);