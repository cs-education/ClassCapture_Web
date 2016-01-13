'use strict';

angular.module('classCaptureApp')
  .factory('resolvedPromise', function ($q) {
  	return (val) => {
  		var deferred = $q.defer();
  		deferred.resolve(val);
  		return deferred.promise;
  	};
  })
  .factory('rejectedPromise', ($q) => {
  	return err => {
		var deferred = $q.defer();
		deferred.reject(err);
		return deferred.promise;
  	};
  });