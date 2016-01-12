'use strict';

angular.module('classCaptureApp')
  .factory('resolvedPromise', function ($q) {
  	return (val) => {
  		var deferred = $q.defer();
  		deferred.resolve(val);
  		return deferred.promise;
  	};
  });