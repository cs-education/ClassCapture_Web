'use strict';

angular.module('classCaptureApp')
  .controller('CreateCourseCtrl', function ($scope, $q, Course, Section) {
    
    // Will set up initial state for course
    function setInitState() {
		$scope.courseDept   = '';
		$scope.courseNumber = '';
		$scope.sections     = [];
		$scope.alerts       = $scope.alerts || []; // never erase any alerts if they are there
    }

    $scope.addNewSection = () => {
    	// Set startTime to be at midnight of epoch with endTime being an hour after startTime
		var startTime = new Date('01 January, 1970 00:00:00');
		var endTime   = new Date('01 January, 1970 01:00:00');

    	$scope.sections.push({
    		'name': '',
    		startTime,
    		endTime
    	});
    };

    $scope.createCourse = () => {
    	Course
    		.save({
    			'department': $scope.courseDept,
    			'number': $scope.courseNumber
    		}).$promise
    		.then(courseObj => {
    			return courseObj.id;
    		})
    		.then(courseID => {
    			var savedSectionsPromises = $scope.sections
    				.map(sectionObj => {
    					return Section.save({
    						'name': sectionObj.name,
    						'startTime': sectionObj.startTime,
    						'endTime': sectionObj.endTime,
    						'course': courseID
    					}).$promise;
    				});

				return $q.all(savedSectionsPromises);
    		})
    		.then(() => {
    			// Put a success alert
    			$scope.alerts.push({
    				'type': 'success',
    				'message': `Created ${$scope.courseDept} ${$scope.courseNumber} with ${$scope.sections.length} sections`
    			});

    			// finally reset form state
				setInitState();
    		})
    		.catch(err => {
    			// Show the error message
    			$scope.alerts.push({
    				'type': 'danger',
    				'message': String(error)
    			});
    		});
    };

    setInitState();
  });
