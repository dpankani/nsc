'use strict';

describe('Service: costEngineSrvc', function () {

    // load the service's module
    beforeEach(module('nscwebappApp'));

    // instantiate service
    var costEngineSrvc;
    beforeEach(inject(function (_costEngineSrvc_) {
        costEngineSrvc = _costEngineSrvc_;
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

    //test cases for testing valid / invalid bmp variables
    var validBMPProps = {
        bmpType: 0,
        footprintAreaSqFt: 1000,
        capacityVolGals: 3000 / 0.133681,
        capitalCost: -1,
        maintCost: -1
    };
    var partialBMPProps = {
        bmpType: 0,
        footprintAreaSqFt: 1000
    };
    var invalidBMPProps = {
        bmpType: '0',
        footprintAreaSqFt: '',
        capacityVolGals: 3000 / 0.133681,
        capitalCost: -1,
        maintCost: -1
    };

    //test cases for testing valid / invalid equations
    var validEqnSlopeIntercept = "y = 0.2142x + 159.75";
    var validEqnSlopeOnly = "y = 0.2142x";
    var invalidEqnNoX = "y = 0.2142 + 159.75";
    var invalidEqnNoY = "x = 0.2142x + 159.75";

    //test cases for testing valid / invalid computeCost inputs
    var bmpSizes = [10, 1, 0.001, 1000, 13285, 235];
    var ccSlope = [0, 1, 0.1, 2, 2000, -2];
    var ccIntercept = [0, 0.1, -0.1, -1000, 1000, 30];
    var inflation = [0, -0.05, 1, 0, 0.1, 0.05];
    var regionalFactors = [0, -1, 1, 0.5, -0.5, 0.05];
    var rslts = [0, 0.005, -0.00001, 0, -1328500000, -35.25];

    it('should exist', function () {
        expect(!!costEngineSrvc).toBe(true);
    });

    //checks for design complexity inputs
    xdescribe('Design complexity input validation tests', function () {
        it('should ensure that valid design complexity input variables validate successfully', function () {
            expect(costEngineSrvc.validateInputs('Complexity', validComplexityVars)).toBe(true);
        });

        it('should ensure that valid partially complete set of design complexity input variables validate successfully', function () {
            expect(costEngineSrvc.validateInputs('Complexity', validPartialComplexityVars)).toBe(true);
        });

        it('should ensure that invalid design complexity input variables do not validate successfully', function () {
            expect(costEngineSrvc.validateInputs('Complexity', invalidComplexityVars)).toBe(false);
        });
    });

    //checks for BMP inputs
    xdescribe('BMP input validation tests', function () {
        it('should ensure that valid bmp input variables validate successfully', function () {
            expect(costEngineSrvc.validateInputs('BMP', validBMPProps)).toBe(true);
        });

        it('should ensure that valid partially complete set of bmp input variables validate successfully', function () {
            expect(costEngineSrvc.validateInputs('BMP', partialBMPProps)).toBe(true);
        });

        it('should ensure that invalid bmp input variables do not validate successfully', function () {
            expect(costEngineSrvc.validateInputs('BMP', invalidBMPProps)).toBe(false);
        });
    });

    //checks for equantion parser
    xdescribe('Equation parser tests', function () {
        it('should correctly extract slope and intercept for valid linear regression equations with both slope and intercept', function () {
            expect(costEngineSrvc.parseLinearEqn(validEqnSlopeIntercept)).toEqual({status: true, slope: 0.2142, intercept: 159.75});
        });

        it('should correctly extract slope and intercept for valid linear regression equations with just slope and no intercept', function () {
            expect(costEngineSrvc.parseLinearEqn(validEqnSlopeOnly)).toEqual({status: true, slope: 0.2142, intercept: 0});
        });

        it('should detect malformed equations with no "x" variable', function () {
            expect(costEngineSrvc.parseLinearEqn(invalidEqnNoX)).toEqual({status: false, slope: -1, intercept: -1});
        });
        it('should detect malformed equations with no "y" variable', function () {
            expect(costEngineSrvc.parseLinearEqn(invalidEqnNoY)).toEqual({status: false, slope: -1, intercept: -1});
        });
    });

    //checks for computeCost function
    describe('computeCost tests', function () {
        it('should correctly compute cost given valid slope, intercept, inflation, and regional factor', function () {
            for (var i = 0; i < 6; i++) {
                console.log(costEngineSrvc.defaultRoundDP,rslts[i]);
                var expected = costEngineSrvc.dpRound(rslts[i],costEngineSrvc.defaultRoundDP);
                var actual = costEngineSrvc.computeCost(bmpSizes[i], ccIntercept[i], ccSlope[i], inflation[i], regionalFactors[i]);
                expect(actual).toEqual(expected);
               // expect(true).toEqual(true);
            }
        });
    });
});
