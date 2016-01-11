angular.module("classCaptureApp")
	.constant('DEFAULT_TIME_RANGE', 2)
	.controller("VideoChooserCtrl", ($scope, $stateParams, $location, $state, DEFAULT_TIME_RANGE, moment, _, MediaPlayer) => {
		// angular bootstrap docs: https://angular-ui.github.io/bootstrap/
		// Check that a valid course hash has been given, it will specify the course to look up for
		console.log('prelim steps');
		if (_.has($stateParams, 'sectionID')) {
			$scope.sectionID = parseInt($stateParams.sectionID); // will decode into an ID
			if (!_.isNumber($scope.sectionID)) {
				$state.go('front.notFound');
			}
		} else {
			$state.go('front.notFound');
		}
		console.log('starting controller');

		// Can specify start and end times with query parameters
		if (!$stateParams.start && !$stateParams.end) {
			$scope.startTime = moment().subtract(DEFAULT_TIME_RANGE, 'hour').toDate();
			$scope.endTime   = moment().add(DEFAULT_TIME_RANGE, 'hour').toDate();
		} else {
			if ($stateParams.start) {
				var startMillis = Number($stateParams.start);

				$scope.startTime  = new Date(startMillis);
			} else {
				$scope.startTime = new Date();
			}

			if ($stateParams.end) {
				var endMillis = Number($stateParams.end);

				$scope.endTime = new Date(endMillis);
			} else {
				$scope.endTime = new Date($scope.startTime.getTime());
				$scope.endTime.setHours($scope.endTime.getHours() + 1);
			}
		}

		$scope.mediaPlayer = new MediaPlayer();

		function searchForVideos() {
			return $scope.mediaPlayer.setInterval({
				startTime: $scope.startTime,
				endTime: $scope.endTime
			});
		}

		$scope.onSearchClicked = () => {

			var updatedQueryParams = {
				'start': $scope.startTime.getTime(),
				'end': $scope.endTime.getTime()
			};

			if (!_.isEqual(updatedQueryParams, $location.search())) {
				// Update start and end query params.
				// This refreshes the page and the videos are searched for when the page reloads
				$location.search(updatedQueryParams);
				// search for the videos within that time interval
				$scope.recordingsState = 'loading';
				searchForVideos()
				.then(recordings => {
					console.log(recordings);
					$scope.recordingsState = _.isEmpty(recordings) ? 'empty' : 'done';
				});
			}
		};

		if ($scope.startTime < $scope.endTime) {
			$scope.recordingsState = 'loading';
			searchForVideos() // Do a search for specified videos
			.then(recordings => {
					if (_.isUndefined(recordings) || !_.isArray(recordings)) {
						throw new Error("Invalid response for recordings result");
					}

					$scope.recordingsState = _.isEmpty(recordings) ? 'empty' : 'done';
			})
			.catch(err => {
				$scope.recordingsState = 'error';
			});
		}
	});