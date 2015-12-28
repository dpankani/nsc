'use strict';

describe('Service: chartengine', function () {

  // load the service's module
  beforeEach(module('nscwebappApp'));

  // instantiate service
  var chartengine;
  beforeEach(inject(function (_chartengine_) {
    chartengine = _chartengine_;
  }));

  it('should do something', function () {
    expect(!!chartengine).toBe(true);
  });

});
