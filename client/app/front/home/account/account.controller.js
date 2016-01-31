'use strict';

angular.module('classCaptureApp')
  .value('ALERT_LIFESPAN_MS', 10e3)
  .controller('AccountCtrl', function ($scope, $state, $modal, authService, Course, Section, _, MIN_PASSWORD_LENGTH, ALERT_LIFESPAN_MS, USER_FIELD_MAPPINGS) {
  	// housekeeping code for setting add sections tab as default tab
    $scope.addSectionsTab = {
      active: true
    };

    $scope.user = {};
  	
  	// For login info
    $scope.login = {
      info: {
        firstName: '',
        lastName: '',
        newPassword: '',
        confirmNewPassword: ''
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

    function isValidPasswordChange() {
      var password = $scope.login.info.newPassword; 
      var confirmNewPassword = $scope.login.info.confirmNewPassword;

      if (_.isEmpty(password) && _.isEmpty(confirmNewPassword)) {
        return true;
      } else {
        return password.length >= MIN_PASSWORD_LENGTH && password === confirmNewPassword;
      }
    }

    $scope.changesAreValid = () => {
      var loginInfo = $scope.login.info;
      var password = loginInfo.newPassword;
      var confirmNewPassword = loginInfo.confirmNewPassword;

      return _.isEmpty($scope.login.form.$error) && isValidPasswordChange();
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
      var modalInstance = $modal.open({
        templateUrl: 'app/front/confirmPasswordModal/confirmPasswordModal.html',
        controller: 'ConfirmPasswordModalCtrl',
        size: 'sm'
      });

      modalInstance.result
      .then(password => {
        // The userInfo will be sent as the update to the backend. Omit unnecessary fields
        var userInfo = _.omit($scope.login.info, 'confirmNewPassword');
        
        // Attatch updated sections list, and password given by modal
        userInfo.id = $scope.user.id;
        userInfo.sections = _.pluck($scope.user.sections, 'id');
        userInfo.password = password; // need to attach password on any User update request

        // Remove any attributes that are empty strings
        userInfo = _.omit(userInfo, val => _.isString(val) && _.isEmpty(val));

        $scope.alertMessages = []; // reset alert messages
        // Send update to backend
        authService.updateUserInfo(userInfo)
        .then(user => {
          $scope.madeUpdate = true;
        })
        .catch(err => {

          if (_.has(err, 'data.error') && err.data.error === 'E_VALIDATION') {
              // We know its a validation error, provide some useful feedback to user
              var invalidAttrs = _.keys(err.data.invalidAttributes).map(attr => USER_FIELD_MAPPINGS[attr]);
              var invalidAttrsMsg = `The following attributes are invalid: ${invalidAttrs.join(', ')}`;
              $scope.alertMessages.push(invalidAttrsMsg);
          }

          $scope.updateFailed = true;
        });
      });
  	};
  });
