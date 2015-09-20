'use strict';

describe('Service: encoder', function () {

  // load the service's module
  beforeEach(module('classCaptureApp'));

  // instantiate service
  var encoder;
  beforeEach(inject(function (_encoder_) {
    encoder = _encoder_;
  }));

  it('should do something', function () {
    expect(!!encoder).toBe(true);
  });

});
