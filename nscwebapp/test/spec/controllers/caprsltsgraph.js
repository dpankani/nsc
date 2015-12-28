'use strict';

describe('Controller: CaprsltsgraphCtrl', function () {

  // load the controller's module
  beforeEach(module('nscwebappApp'));

  var CaprsltsgraphCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CaprsltsgraphCtrl = $controller('CaprsltsgraphCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CaprsltsgraphCtrl.awesomeThings.length).toBe(3);
  });
});
