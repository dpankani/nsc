'use strict';

describe('Service: designComplexity', function () {

    // load the service's module
    beforeEach(module('nscwebappApp'));

    // instantiate service
    var designComplexity;
    beforeEach(inject(function (_designComplexity_) {
        designComplexity = _designComplexity_;
    }));

    //test cases for testing valid / invalid design complexity variables
    var validComplexityVars = {
        isNewDevelopment: false,
        isReDevelopment: true,
        hasPretreatment: true,
        siteSuitability: 2,
        topography: 2,
        soilType: 2
    };
    var validPartialComplexityVars = {
        isNewDevelopment: false,
        isReDevelopment: true,
        soilType: 2
    };
    var invalidComplexityVars = {
        isNewDevelopment: -1,
        isReDevelopment: 10,
        hasPretreatment: 'true',
        siteSuitability: 5,
        topography: 6,
        soilType: 7
    };
    //test cases for testing design complexity computations
    var simpleComplexityVars = {
        isNewDevelopment: false,
        isReDevelopment: true,
        hasPretreatment: true,
        siteSuitability: 2,
        topography: 0,
        soilType: 0
    };
    var typicalComplexityVars = {
        isNewDevelopment: false,
        isReDevelopment: true,
        hasPretreatment: true,
        siteSuitability: 2,
        topography: 1,
        soilType: 1
    };
    var complexComplexityVars = {
        isNewDevelopment: false,
        isReDevelopment: true,
        hasPretreatment: true,
        siteSuitability: 0,
        topography: 2,
        soilType: 2
    };

    it('should exist', function () {
        expect(!!designComplexity).toBe(true);
    });

    it('should ensure that valid design complexity input variables validate successfully', function () {
        expect(designComplexity.validateInputs(validComplexityVars)).toBe(true);
    });

    it('should ensure that valid partially complete set of design complexity input variables validate successfully', function () {
        expect(designComplexity.validateInputs(validPartialComplexityVars)).toBe(true);
    });

    it('should ensure that invalid design complexity input variables do not validate successfully', function () {
        expect(designComplexity.validateInputs(invalidComplexityVars)).toBe(false);
    });

    it('should compute to simple complexity given simple complexity input variables', function () {
        expect(designComplexity.computeDesignComplexity(simpleComplexityVars)).toBe(designComplexity.designComplexity.simple);
    });

    it('should compute to typical complexity given typical complexity input variables', function () {
        expect(designComplexity.computeDesignComplexity(typicalComplexityVars)).toBe(designComplexity.designComplexity.typical);
    });

    it('should compute to high complexity given complex complexity input variables', function () {
        expect(designComplexity.computeDesignComplexity(complexComplexityVars)).toBe(designComplexity.designComplexity.complex);
    });

});
