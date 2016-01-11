'use strict';

angular.module('classCaptureApp')
  .value('ALERT_LIFESPAN_MS', 10e3)
  .controller('AccountCtrl', function ($scope, $state, $timeout, authService, Course, Section, _, MIN_PASSWORD_LENGTH, ALERT_LIFESPAN_MS) {
  	$scope.user = {};
  	
  	// For login info
    $scope.login = {
      info: {
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
      }
    };

  	// For search
  	$scope.searchTerms = {
  		department: '',
  		number: undefined
  	};

  	$scope.resultSections = [];

    // For alerts
    $scope.madeUpdate = false;
    $scope.updateFailed = false;
    $scope.alertMessages = [];

    $scope.changesAreValid = () => {
      var loginInfo = $scope.login.info;
      var password = loginInfo.password;
      var confirmPassword = loginInfo.confirmPassword;

      return _.isEmpty($scope.login.form.$error) && password.length >= MIN_PASSWORD_LENGTH && password === confirmPassword;
    };

  	$scope.search = () => {
  		Course.query({
  			department: $scope.searchTerms.department,
  			number: Number($scope.searchTerms.number)
  		}).$promise
  		.then(courses => {
  			$scope.resultSections = _.flatten(courses.map(course => {
          // For each section, set the corresponding course as an attribute called 'course'
  				// circular dependency...watch out
  				course.sections.forEach(section => section.course = course);
  				return course.sections;
  			}));
  		});
  	};

  	$scope.userIsRegisteredForSection = section => {
  		return _.findWhere($scope.user.sections, {id: section.id});
  	};

  	$scope.validSearchTerms = () => _.isEmpty($scope.searchTerms.searchForm.$error);

  	authService.getLoggedInUser()
  	.then(user => {
  		$scope.user = user;
      $scope.login = {
        info: {
          firstName: user.firstName,
          lastName: user.lastName
        }
      };
      // Sort course info
  		var sortedSections = _.sortBy(user.sections, 'course.department', 'course.number', 'name');
      // This needs to be done to succesfully updates the tables
      // Delete all the entries in the sections table
  		$scope.user.sections.splice(0,$scope.user.sections.length);
      // Add each of the sections just received in sorted order
  		$scope.user.sections.splice(0, 0, ...sortedSections);
  	})
  	.catch(err => {
  		$state.go('front.login');
  	});

  	$scope.getCourseName = (course) => {
  		return `${course.department} ${course.number}`;
  	};

  	$scope.submit = () => {
      var userInfo = _.omit($scope.login.info, 'confirmPassword');
      userInfo.id = $scope.user.id;
      userInfo.sections = _.pluck($scope.user.sections, 'id');
      // Remove any attributes that are empty strings/arrays
      userInfo = _.omit(userInfo, _.isEmpty);
      authService.updateUserInfo(userInfo)
      .then(user => {
        $scope.madeUpdate = true;
      })
      .catch(err => {
        $scope.alertMessages = [];

        if (err.data.error === 'E_VALIDATION') {
            // We know its a validation error, provide some feedback to user
            _.forEach(err.data.invalidAttributes, (reasons, attr) => {
                var newMessages = _.pluck(reasons, 'message');
                $scope.alertMessages = $scope.alertMessages.concat(newMessages);
            });
        }

        $scope.updateFailed = true;
      });
  	};
  });
