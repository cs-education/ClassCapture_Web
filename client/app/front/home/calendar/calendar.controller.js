'use strict';

angular.module('classCaptureApp')
  .constant('EXTRA_INTERVAL_HOURS', 3)
  .constant('CLUSTER_DISTANCE_MINUTES', 30)
  .constant('MIN_EVENT_DURATION_MINUTES', 15)
  .controller('CalendarCtrl', function ($scope, $state, $q, uiCalendarConfig, authService, Course, Recording, buildIntervalQuery, _, moment, resolvedPromise, EXTRA_INTERVAL_HOURS, CLUSTER_DISTANCE_MINUTES, MIN_EVENT_DURATION_MINUTES) {
    $scope.eventSources = {
    	events: []
    };

    $scope.calendarStart = null;
    $scope.calendarEnd = null;
    $scope.onCalendarTimeChange = _.noop;

    $scope.calendarConfig = {
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView: 'basicWeek',
    	editable: false,
        viewRender: function(view, element) {
            $scope.onCalendarTimeChange(view.start, view.end);
        }
    };

    // helpers for clusterRecordings
    function minDate(a, b) {
        return a < b ? a : b;
    }

    function maxDate(a, b) {
        return a > b ? a : b;
    }

    function clustersOverlap(clusterA, clusterB) {
        var checkOverlap = (a, b) => {
            var bIsWithinA = b.start >= a.start && b.start <= a.end;
            var closenessCheck = Math.abs(moment(a.end).diff(moment(b.start), 'minutes')) <= CLUSTER_DISTANCE_MINUTES;
            return bIsWithinA || closenessCheck;
        };

        return checkOverlap(clusterA, clusterB) || checkOverlap(clusterB, clusterA);
    }

    function mergeCluster(toCluster, fromCluster) {
        toCluster.start = minDate(toCluster.start, fromCluster.start);
        toCluster.end   = maxDate(toCluster.end, fromCluster.end);
    }

    function getEventDuration(event, unit) {
        unit = unit || 'ms';
        return moment(event.end).diff(event.start, unit);
    }

    function clusterRecordings(recordings) {
        var clusters = recordings.map(recording => {
            return {
                start: recording.startTime,
                end: recording.endTime
            };
        });

        for (var idx = 0; idx < clusters.length; idx++) {
            var currCluster = clusters[idx];
            for (var compareIdx=idx+1; compareIdx < clusters.length; compareIdx++) {
                var compareCluster = clusters[compareIdx];

                if (clustersOverlap(currCluster, compareCluster)) {
                    mergeCluster(currCluster, compareCluster);
                    // remove the cluster from the array since its been merged with the current one
                    clusters.splice(compareIdx, 1);
                    compareIdx--; // since we just removed the compareIdx1 element from the array
                }
            }
        }

        return clusters;
    }

    authService.getLoggedInUser()
    .then(user => {
        $scope.onCalendarTimeChange = (newStart, newEnd) => {
            if (newStart.isSame($scope.calendarStart) && newEnd.isSame($scope.calendarEnd)) {
                return; // no change has occurred
            }

            $scope.calendarStart = newStart.subtract(EXTRA_INTERVAL_HOURS, 'hours').toDate();
            $scope.calendarEnd = newEnd.add(EXTRA_INTERVAL_HOURS, 'hours').toDate();

            var coursePromises = user.sections.map(section => {
                if (_.isNumber(section.course)) {
                    section.course = Course.get({
                        id: section.course
                    });

                    return section.course.$promise;
                } else {
                    // the course field was already populated from the last call
                    return resolvedPromise(section.course);
                }
            });

            var recordingsPromises = user.sections.map(section => {
                var query = buildIntervalQuery({
                    startTime: $scope.calendarStart,
                    endTime: $scope.calendarEnd
                }, section.id);

                return Recording.query(query).$promise;
            });

            $q.all({
                courses: $q.all(coursePromises),
                recordings: $q.all(recordingsPromises)
            })
            .then(({courses, recordings}) => {
                var sectionNames = user.sections.map(section => `${section.course.department} ${section.course.number}: ${section.name}`);
                var sectionRecordings = _.zipObject(sectionNames, recordings);
                // sectionRecordings is an object like: {'<SectionTitle>': [<Recording for Section>, ...]}
                var events = _.reduce(sectionRecordings, function (events, eventRecordings, eventTitle) {
                    if (_.isEmpty(eventRecordings)) {
                        return events;
                    }

                    var clusteredRecordingEvents = clusterRecordings(eventRecordings);
                    var sectionID = _.first(eventRecordings).section.id;
                    
                    clusteredRecordingEvents.forEach(recordingEvent => {
                        var start = new Date(recordingEvent.start).getTime();
                        var end   = new Date(recordingEvent.end).getTime();
                        
                        recordingEvent.title = eventTitle;
                        recordingEvent.url = `/front/videoChooser/${sectionID}?start=${start}&end=${end}`;

                        if (getEventDuration(recordingEvent, 'minutes') < MIN_EVENT_DURATION_MINUTES) {
                            // If an event is very short, it will just show up as a tiny blip on the calendar
                            // We want any event of any duration to at least show upon the calendar so we
                            // artificially extend the short ones.
                            recordingEvent.end = moment(recordingEvent.end).add(15, 'minutes').toDate().toISOString();
                        }
                    });
                    return events.concat(clusteredRecordingEvents);
                }, []);

                $scope.eventSources.events = events;
            });
        };
    })
    .catch(err => {
    	$state.go('front.login');
    });

    $scope.$watch('eventSources.events', (newVal, oldVal) => {
        if (!(_.isEqual(newVal, oldVal))) {
            // This needs to be done to refresh the calendar view
            uiCalendarConfig.calendars.cal.fullCalendar('removeEvents');
            uiCalendarConfig.calendars.cal.fullCalendar('addEventSource', $scope.eventSources.events);
        }
    });

  });
