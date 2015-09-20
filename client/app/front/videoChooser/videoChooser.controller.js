angular.module("classCaptureApp")
	.controller("VideoChooserCtrl", ($scope, $stateParams, $location, $state, _, encoder, MediaPlayer) => {
		// angular bootstrap docs: https://angular-ui.github.io/bootstrap/
		// Check that a valid course hash has been given, it will specify the course to look up for
		if (_.has($stateParams, 'courseHash')) {
			$scope.courseID = encoder.decode($stateParams.courseHash); // will decode into an ID
			if (!_.isNumber($scope.courseID)) {
				$state.go('front.notFound');
			} else {
				// Set $scope.title according to the course title. e.g. "CS 225"
				// Must first fetch course object from courseID
				// course
				// 	.get({'id': $scope.courseID}).$promise
				// 	.then(courseObj => {
				// 		// Set page title according to received course info
				// 		$scope.title = `${courseObj.department} ${courseObj.number}`
				// 	});
			}
		} else {
			$state.go('front.notFound');
		}
		// Can specify start and end times with query parameters
		if ($stateParams.start) {
			var startMillis = Number($stateParams.start);

			$scope.startTime  = new Date(startMillis);
			$scope.chosenDate = new Date(startMillis);
		} else {
			$scope.startTime = new Date();
		}

		if ($stateParams.end) {
			var endMillis = Number($stateParams.end);

			$scope.endTime    = new Date(endMillis);
			$scope.chosenDate = $scope.chosenDate || new Date(endMillis);
		} else {
			$scope.endTime = new Date($scope.startTime.getTime());
			$scope.endTime.setHours($scope.endTime.getHours() + 1);
		}
		
		$scope.chosenDate = $scope.chosenDate || new Date();

		$scope.mediaPlayer = new MediaPlayer();

		/**
		 * Given 2 Date objects: day & time
		 * day - day that you want the returned date to be on
		 * time - time that you want the returned date to be on
		 */
		function getDateFromDayAndTime(day, time) {
			var date = new Date(day.getTime());
			
			date.setHours(time.getHours());
			date.setMinutes(time.getMinutes());
			date.setSeconds(time.getSeconds());
			date.setMilliseconds(time.getMilliseconds());
			console.log(date);
			return date;
		}

		function searchForVideos() {
			var startTime = getDateFromDayAndTime($scope.chosenDate, $scope.startTime);
			var endTime   = getDateFromDayAndTime($scope.chosenDate, $scope.endTime);

			var resultsPromise = $scope.mediaPlayer.setInterval({startTime, endTime});
			return resultsPromise;
		}

		$scope.onSearchClicked = () => {
			var startTime = getDateFromDayAndTime($scope.chosenDate, $scope.startTime);
			var endTime   = getDateFromDayAndTime($scope.chosenDate, $scope.endTime);

			var updatedQueryParams = {
				'start': startTime.getTime(),
				'end': endTime.getTime()
			};

			if (!_.isEqual(updatedQueryParams, $location.search())) {
				// Update start and end query params.
				// This refreshes the page and the videos are searched for when the page reloads
				$location.search(updatedQueryParams);
				// search for the videos within that time interval
				searchForVideos();
			}
		};

		if ($scope.startTime < $scope.endTime) {
			searchForVideos(); // Do a search for specified videos
		}
	});