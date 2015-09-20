'use strict';

describe('Controller: CreateCourseCtrl', function () {

  // load the controller's module
  beforeEach(module('classCaptureApp'));

  var CreateCourseCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateCourseCtrl = $controller('CreateCourseCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
