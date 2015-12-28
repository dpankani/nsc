'use strict';

/**
 * @ngdoc function
 * @name nscwebappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nscwebappApp
 */

//TODO .Net browser control compatibility tips <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9" />
//source http://blog.diniscruz.com/2013/06/if-angularjs-doesnt-work-on-your-o2.html
//https://stackoverflow.com/questions/25031979/using-web-browser-control-with-angularjs
//https://stackoverflow.com/questions/28526826/web-browser-control-emulation-issue-feature-browser-emulation/28626667#28626667
angular.module('nscwebappApp')
        .controller('MainCtrl', function (designComplexity, costEngineSrvc,chartengine) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

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
            var batchComplexity = [simpleComplexityVars, typicalComplexityVars, complexComplexityVars];

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
            var batchBMPs = [validBMPProps, partialBMPProps, invalidBMPProps];

            //equantion parser
            var validEqnSlopeIntercept = "y = 0.2142x + 159.75";
            var validEqnSlopeOnly = "y = 0.2142x";
            var invalidEqnNoX = "y = 0.2142 + 159.75";
            var invalidEqnNoY = "x = 0.2142x + 159.75";
            var eqns = [validEqnSlopeIntercept, validEqnSlopeOnly, invalidEqnNoX, invalidEqnNoY];

            //alert("test");

            /*$.each(batchComplexity, function (idx, val) {
             designComplexity.computeDesignComplexity(val);
             });
             
             $.each(batchComplexity, function (idx, val) {
             costEngineSrvc.validateInputs('BMP', val);
             });*/

            /*$.each(eqns, function (idx, val) {
             costEngineSrvc.parseLinearEqn(val);
             });*/

            var bmpSizes = [10, 1, 0.001, 1000, 13285, 235];
            var ccSlope = [0, 1, 0.1, 2, 2000, -2];
            var ccIntercept = [0, 0.1, -0.1, -1000, 1000, 30];
            var inflation = [0, -0.05, 1, 0, 0.1, 0.05];
            var regionalFactors = [0, -1, 1, 0.5, -0.5, 0.05];
            var rslts = [0, 0.005, -0.00001, 0, -1328500000, -35.25];
            for (var i = 0; i < 6; i++) {
                var cost = costEngineSrvc.computeCost(bmpSizes[i], ccIntercept[i], ccSlope[i], inflation[i], regionalFactors[i]);
            }
            
            
            chartengine.mockupCharts();
        });
