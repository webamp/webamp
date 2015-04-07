'use strict';

describe('Service: Soundcloud', function () {

  // load the service's module
  beforeEach(module('WebampApp'));

  // instantiate service
  var Soundcloud;
  beforeEach(inject(function (_Soundcloud_) {
    Soundcloud = _Soundcloud_;
  }));

  it('should do something', function () {
    expect(!!Soundcloud).toBe(true);
  });

});
