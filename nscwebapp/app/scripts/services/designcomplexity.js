'use strict';

/**
 * @ngdoc service
 * @name nscwebappApp.designComplexity
 * @description
 * # designComplexity
 * Factory in the nscwebappApp.
 */
angular.module('nscwebappApp')
        .factory('designComplexity', function () {

            //lookup table of assignments used to compute design complexity based on work done in Phase I and
            //documented in the final report. These values are multiplied with user input
            //complexity values, summed and the largest number indicates the design complexity
            //if there is a tie, the higher complexity wins
            var categoricalStrikeAssignments = {
                isNewDevelopment: {simple: 1, typical: 0, complex: 0},
                isReDevelopment: {simple: 0, typical: 1, complex: 1},
                hasPretreatment: {simple: 0, typical: 1, complex: 1},
                siteSuitability: [{simple: 0, typical: 0, complex: 1}, {simple: 0, typical: 1, complex: 0}, {simple: 1, typical: 0, complex: 0}],
                topography: [{simple: 1, typical: 0, complex: 0}, {simple: 1, typical: 1, complex: 0}, {simple: 0, typical: 1, complex: 0}, {simple: 0, typical: 0, complex: 1}],
                soilType: [{simple: 1, typical: 0, complex: 0}, {simple: 0, typical: 1, complex: 0}, {simple: 0, typical: 0, complex: 1}, {simple: 0, typical: 0, complex: 1}]
            };

            //begin psuedo enums
            var designComplexity = {
                invalid: -1,
                simple: 0,
                typical: 1,
                complex: 2
            };
            var suitability = Object.freeze({
                poor: 0,
                moderate: 1,
                excellent: 2
            });
            var topography = Object.freeze({
                flat: 0,
                moderateFlat: 1,
                moderateSteep: 2,
                steep: 3
            });
            var soilType = Object.freeze({
                A: 0,
                B: 1,
                C: 2,
                D: 3
            });

            var defaultComplexityVars = {
                isNewDevelopment: false,
                isReDevelopment: true,
                hasPretreatment: true,
                siteSuitability: suitability.moderate,
                topography: topography.steep,
                soilType: soilType.A
            };

            // Public API here
            var service = {
                validateInputs: validateInputs,
                designComplexity: designComplexity,
                computeDesignComplexity: computeDesignComplexity,
                
            };
            return service;
            ///////////////////////////
            function validateInputs(options) {
                options = angular.extend({}, defaultComplexityVars, options);
                var flag = (options.isNewDevelopment !== undefined && typeof (options.isNewDevelopment) === 'boolean');

                flag = flag && (options.isReDevelopment !== undefined && typeof (options.isReDevelopment) === 'boolean');

                flag = flag && (options.isReDevelopment === !options.isNewDevelopment);

                flag = flag && (options.hasPretreatment !== undefined && typeof (options.hasPretreatment) === 'boolean');

                flag = flag && (options.siteSuitability !== undefined && typeof (options.siteSuitability) === 'number' &&
                        options.siteSuitability >= suitability.poor && options.siteSuitability <= suitability.excellent);

                flag = flag && (options.topography !== undefined && typeof (options.topography) === 'number' &&
                        options.topography >= topography.flat && options.topography <= topography.steep);
                flag = flag && (options.soilType !== undefined && typeof (options.soilType) === 'number' &&
                        options.soilType >= soilType.A && options.soilType <= soilType.D);
                return flag;
            }

            function computeDesignComplexity(options) {
                var flag = validateInputs(options);
                var tempRow;

                //complexity strike sum tally used to hold sums for simple, typical and complex
                //var strikes = [0, 0, 0];
                var strikes = {simple: 0, typical: 0, complex: 0};

                if (flag) {

                    //sum strikes for new development /redevelopment
                    if (options.isNewDevelopment) {
                        $.each(categoricalStrikeAssignments.isNewDevelopment, function (idx, val) {
                            strikes[idx] = strikes[idx] + val;
                        });
                    } else {
                        $.each(categoricalStrikeAssignments.isReDevelopment, function (idx, val) {
                            strikes[idx] = strikes[idx] + val;
                        });
                    }

                    //sum strikes for new development /redevelopment
                    if (options.hasPretreatment) {
                        $.each(categoricalStrikeAssignments.hasPretreatment, function (idx, val) {
                            strikes[idx] = strikes[idx] + val;
                        });
                    }

                    //sum strikes for suitability
                    tempRow = categoricalStrikeAssignments.siteSuitability[options.siteSuitability];
                    $.each(tempRow, function (idx, val) {
                        strikes[idx] = strikes[idx] + val;
                    });

                    //sum strikes for topography
                    tempRow = categoricalStrikeAssignments.topography[options.topography];
                    $.each(tempRow, function (idx, val) {
                        strikes[idx] = strikes[idx] + val;
                    });

                    //sum strikes for soilType
                    tempRow = categoricalStrikeAssignments.soilType[options.soilType];
                    $.each(tempRow, function (idx, val) {
                        strikes[idx] = strikes[idx] + val;
                    });

                    //find max strike and return it complexit
                    if (strikes.complex >= strikes.typical && strikes.complex >= strikes.simple) {
                        return designComplexity.complex;
                    } else if (strikes.typical >= strikes.complex && strikes.typical >= strikes.simple) {
                        return designComplexity.typical;
                    } else {
                        return designComplexity.simple;
                    }
                } else {
                    return -1;
                }
            }
        });
