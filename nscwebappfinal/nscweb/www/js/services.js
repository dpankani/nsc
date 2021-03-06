/* global angular */
/* global d3 */
/* global c3 */

'use strict';
/**
 * @ngdoc service
 * @name nscwebappApp.chartengine
 * @description
 * # chartengine
 * Service in the nscwebappApp.
 */

//error bars code http://qiita.com/ku0522a/items/19934339c69037171b31
angular.module('nscwebappApp.services', [])

        .service('chartengine', function () {

            //    var bmpTypes = ['Disconnection', 'Rain Harvesting','Rain Gardens',
            //'Green Roofs','Street Planters','Infiltration Basins','Permeable Pavement', 'Vegetated Swale'];
            var costData = {
                DC: {
                    capital: {amount: 81537, complexity: 1},
                    maintenance: {amount: 100, complexity: -1}
                },
                RH: {
                    capital: {amount: 146123, complexity: 1},
                    maintenance: {amount: 100, complexity: -1}
                },
                RG: {
                    capital: {amount: 103596, complexity: 1},
                    maintenance: {amount: 100, complexity: -1}
                },
                GR: {
                    capital: {amount: 207989, complexity: 1},
                    maintenance: {amount: 100, complexity: -1}
                },
                SP: {
                    capital: {amount: 214420, complexity: 1},
                    maintenance: {amount: 100, complexity: -1}
                },
                IB: {
                    capital: {amount: 313734, complexity: 1},
                    maintenance: {amount: 100, complexity: -1}
                },
                PP: {
                    capital: {amount: 894613, complexity: 1},
                    maintenance: {amount: 100, complexity: -1}
                },
                VS: {
                    capital: {amount: 114641, complexity: 1},
                    maintenance: {amount: 100, complexity: -1}
                }
            };
            // Public API here
            var service = {
                validateInputs: validateInputs,
                mockupCharts: mockupCharts
            };
            return service;
            ///////////////////////////
            function validateInputs() {

            }

            function mockupCharts() {
                var chartTitles = {
                    baseline: 'Baseline Scenario',
                    current: 'Current Scenario'
                };
                var chartTypes = {
                    bar: 'bar',
                    pie: 'pie',
                    donut: 'donut'
                };
                var dollarLabelFormatFxn = function (value, ratio, id) {
                    return d3.format('$0,000')(value);
                };

                var chartData = formatDataForChart(costData);

                //begin captical cost charts
                //3. generate baseline bar chart - capital cost
                var bc5 = generateChart('#bc-bar', chartTypes.bar, chartData.capital, chartData.capitalErrors);
                var bc6 = generateChart('#ac-bar', chartTypes.bar, chartData.capital, chartData.capitalErrors);

                //begin maintenance cost charts
                //3. generate baseline bar chart - capital cost
                var bm5 = generateChart('#bm-bar', chartTypes.bar, chartData.capital, chartData.capitalErrors);
                var bm6 = generateChart('#am-bar', chartTypes.bar, chartData.capital, chartData.capitalErrors);
            }

            function formatDataForChart(costData) {
                var tempNum = 0;
                var capitalCostResults = [];
                var capitalCostResultsHigh = [];
                var capitalErrors = {};

                var maintCostResults = [];
                var maintCostResultsHigh = [];
                var maintenanceErrors = {};

                var labelFormatsCap = {};
                var labelFormatsMaint = {};
                var tempHighFrac = 1.15;

                $.each(costData, function (idx, val) {
                    tempNum = parseFloat(val.capital.amount) * tempHighFrac;
                    capitalCostResults.push([idx, val.capital.amount]);
                    capitalCostResultsHigh.push([idx, tempNum]);
                    capitalErrors[idx] = [tempNum - val.capital.amount];

                    tempNum = parseFloat(val.maintenance.amount) * tempHighFrac;
                    maintCostResults.push([idx, val.maintenance.amount]);
                    maintCostResultsHigh.push([idx, parseFloat(val.maintenance.amount) * tempHighFrac]);
                    maintenanceErrors[idx] = [tempNum - val.maintenance.amount];

                    labelFormatsCap[idx] = d3.format('$');
                    labelFormatsMaint[idx] = d3.format('$');
                });

                return {
                    capital: capitalCostResults,
                    capitalHigh: capitalCostResultsHigh,
                    capitalErrors: capitalErrors,
                    maintenance: maintCostResults,
                    maintenanceHigh: maintCostResultsHigh,
                    maintenanceErrors: maintenanceErrors,
                    labelFormatsCap: labelFormatsCap,
                    labelFormatsMaint: labelFormatsMaint
                };
            }

            function generateChart(container, chartType, chartColumns, chartErrors, title, labelFormatFxn) {

                var chart = c3.generate({
                    bindto: container || '#chart',
                    /*color: {
                     pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
                     },*/
                    data: {
                        columns: chartColumns,
                        type: chartType || 'bar',
                        errors: chartErrors
                    },
                    color: {
                        //pattern: ['#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b']
                        pattern: ['#fee391', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#4C6C84'] //, '#0c2c84'
                    },
                    labels: {
                        format: function (v, id, i, j) {
                            return d3.format('$');
                        }
                    },
                    donut: {
                        title: title || 'NA',
                        label: {
                            format: labelFormatFxn
                        }
                    },
                    bar: {
                        width: {
                            ratio: 1 // this makes bar width 50% of length between ticks
                        }
                    },
                    tooltip: {
                        grouped: false, // Default true
                        format: {
                            title: function (d, t1, t2) {
                                console.log(t1, t2);
                                //return 'Data ' + d;
                                //return bmpTypes[d];
                                return '';
                            },
                            value: function (value, ratio, id) {
                                //var format = id === 'data1' ? d3.format(',') : d3.format('$');
                                var format = d3.format("$,");
                                return format(value);
                            }
                        }
                    },
                    axis: {
                        x: {
                            type: 'category',
                            tick: {
                                values: ['']
                            }
                        }
                        ,
                        y: {
                            tick: {
                                format: d3.format("$,")
                            }
                        }
                    }
                }
                );
                return chart;
            }
        })
        .factory('costEngineSrvc', function (designComplexity) {

            var dataVersion = '0.0.1';
            var eqnsVersion = '0,0.1';
            var dataReferenceYear = 2014; //used for inflation calcs
            var defaultRoundDP = 3; // default number of decimal places to round to
            var costData = {//generated using excel/vba framework - TODO add name property to excel framework
                DC: {
                    "Capital": {"simpleEquation": "y = 0.2142x + 159.75", "simpleRSquared": "R² = 1", "simple_upperEquation": "y = 1.9321x + 1041.3", "simple_upperRSquared": "R² = 1", "typicalEquation": "y = 3.65x + 1922.8", "typicalRSquared": "R² = 1", "typical_upperEquation": "y = 4.6869x + 2864.7", "typical_upperRSquared": "R² = 1", "complexEquation": "y = 5.7238x + 3806.5", "complexRSquared": "R² = 1", "complex_upperEquation": "y = 6.7608x + 4748.3", "complex_upperRSquared": "R² = 1", },
                    "Maintenance": {"simpleEquation": "y = 0.05x + 1E-13", "simpleRSquared": "R² = 1", "complexEquation": "y = 0.0751x", "complexRSquared": "R² = 1", },
                    name: 'Disconnection'
                },
                RH: {
                    "Capital": {"simpleEquation": "y = 0.3844x + 61.8", "simpleRSquared": "R² = 1", "simple_upperEquation": "y = 0.577x + 1812.9", "simple_upperRSquared": "R² = 1", "typicalEquation": "y = 0.7697x + 3564", "typicalRSquared": "R² = 1", "typical_upperEquation": "y = 1.0891x + 3957", "typical_upperRSquared": "R² = 1", "complexEquation": "y = 1.4085x + 4350", "complexRSquared": "R² = 1", "complex_upperEquation": "y = 1.728x + 4743", "complex_upperRSquared": "R² = 1", },
                    "Maintenance": {"simpleEquation": "y = 0.1003x + 0.0002", "simpleRSquared": "R² = 1", "complexEquation": "y = 0.2407x + 0.0006", "complexRSquared": "R² = 1", },
                    name: 'Rainwater Harvesting'
                },
                RG: {
                    "Capital": {"simpleEquation": "y = 0.2717x + 346.08", "simpleRSquared": "R² = 1", "simple_upperEquation": "y = 0.9204x + 2021", "simple_upperRSquared": "R² = 1", "typicalEquation": "y = 1.5691x + 3696", "typicalRSquared": "R² = 1", "typical_upperEquation": "y = 3.29x + 6873.8", "typical_upperRSquared": "R² = 1", "complexEquation": "y = 5.0109x + 10052", "complexRSquared": "R² = 1", "complex_upperEquation": "y = 6.7319x + 13229", "complex_upperRSquared": "R² = 1", },
                    "Maintenance": {"simpleEquation": "y = 0.0675x", "simpleRSquared": "R² = 1", "complexEquation": "y = 1.632x", "complexRSquared": "R² = 1", },
                    name: 'Rain Gardens'
                },
                GR: {
                    "Capital": {"simpleEquation": "y = 0.5421x + 1975.2", "simpleRSquared": "R² = 1", "simple_upperEquation": "y = 1.5215x + 2631.6", "simple_upperRSquared": "R² = 1", "typicalEquation": "y = 2.5009x + 3288", "typicalRSquared": "R² = 1", "typical_upperEquation": "y = 5.0205x + 12056", "typical_upperRSquared": "R² = 1", "complexEquation": "y = 7.5401x + 20824", "complexRSquared": "R² = 1", "complex_upperEquation": "y = 10.06x + 29592", "complex_upperRSquared": "R² = 1", },
                    "Maintenance": {"simpleEquation": "y = 0.0281x + 6E-14", "simpleRSquared": "R² = 1", "complexEquation": "y = 0.2821x + 1E-12", "complexRSquared": "R² = 1", },
                    name: 'Green Roofs'
                },
                SP: {
                    "Capital": {"simpleEquation": "y = 0.5592x + 1928.2", "simpleRSquared": "R² = 1", "simple_upperEquation": "y = 1.6359x + 2254.4", "simple_upperRSquared": "R² = 1", "typicalEquation": "y = 2.7125x + 2580.6", "typicalRSquared": "R² = 1", "typical_upperEquation": "y = 6.5348x + 8371.9", "typical_upperRSquared": "R² = 1", "complexEquation": "y = 10.357x + 14163", "complexRSquared": "R² = 1", "complex_upperEquation": "y = 14.179x + 19955", "complex_upperRSquared": "R² = 1", },
                    "Maintenance": {"simpleEquation": "y = 0.045x", "simpleRSquared": "R² = 1", "complexEquation": "y = 1.0697x + 4E-12", "complexRSquared": "R² = 1", },
                    name: 'Street Planters'
                },
                IB: {
                    "Capital": {"simpleEquation": "y = 0.8205x + 1928.2", "simpleRSquared": "R² = 1", "simple_upperEquation": "y = 0.8339x + 2896.1", "simple_upperRSquared": "R² = 1", "typicalEquation": "y = 0.8473x + 3864", "typicalRSquared": "R² = 1", "typical_upperEquation": "y = 2.3002x + 8457", "typical_upperRSquared": "R² = 1", "complexEquation": "y = 3.7531x + 13050", "complexRSquared": "R² = 1", "complex_upperEquation": "y = 5.2059x + 17643", "complex_upperRSquared": "R² = 1", },
                    "Maintenance": {"simpleEquation": "y = 0.0487x + 2E-13", "simpleRSquared": "R² = 1", "complexEquation": "y = 1.7689x + 8E-12", "complexRSquared": "R² = 1", },
                    name: 'Infiltration Basins'},
                PP: {
                    "Capital": {"simpleEquation": "y = 2.3502x + 1545", "simpleRSquared": "R² = 1", "simple_upperEquation": "y = 3.5355x + 1672.5", "simple_upperRSquared": "R² = 1", "typicalEquation": "y = 4.7209x + 1800", "typicalRSquared": "R² = 1", "typical_upperEquation": "y = 6.2951x + 2775", "typical_upperRSquared": "R² = 1", "complexEquation": "y = 7.8694x + 3750", "complexRSquared": "R² = 1", "complex_upperEquation": "y = 9.4437x + 4725", "complex_upperRSquared": "R² = 1", },
                    "Maintenance": {"simpleEquation": "y = 0.0563x", "simpleRSquared": "R² = 1", "complexEquation": "y = 0.3075x + 1E-12", "complexRSquared": "R² = 1", },
                    name: 'Permeable Pavement'
                },
                VS: {
                    "Capital": {"simpleEquation": "y = 0.2997x + 772.5", "simpleRSquared": "R² = 1", "simple_upperEquation": "y = 0.4329x + 1061.2", "simple_upperRSquared": "R² = 1", "typicalEquation": "y = 0.5662x + 1350", "typicalRSquared": "R² = 1", "typical_upperEquation": "y = 0.7534x + 1612.5", "typical_upperRSquared": "R² = 1", "complexEquation": "y = 0.9406x + 1875", "complexRSquared": "R² = 1", "complex_upperEquation": "y = 1.1278x + 2137.5", "complex_upperRSquared": "R² = 1", },
                    "Maintenance": {"simpleEquation": "y = 0.0626x", "simpleRSquared": "R² = 1", "complexEquation": "y = 0.1215x - 5E-13", "complexRSquared": "R² = 1", },
                    name: 'Vegetated Swales'
                }
            };
            //begin psuedo enums
            var bmpTypes = {
                DC: 0, //impervious disconnection
                RH: 1, //rain harvesting
                RG: 2, //rain garden
                GR: 3, //green roofs
                SP: 4, //street planter
                IB: 5, //infiltration basin
                PP: 6, //permeable pavement
                VS: 7//vegetated swale
            };
            var defaultBMPProps = {
                bmpType: bmpTypes.RG,
                footprintAreaSqFt: 0,
                capacityVolGals: 0,
                capitalCost: -1,
                maintCost: -1
            };
            // Public API here
            var service = {
                costData:costData,
                dataVersion: dataVersion,
                eqnsVersion: eqnsVersion,
                dataReferenceYear: dataReferenceYear,
                validateInputs: validateInputs,
                parseLinearEqn: parseLinearEqn,
                computeCost: computeCost,
                computeLIDCtrlCost: computeLIDCtrlCost,
                computeLIDCtrlCosts: computeLIDCtrlCosts,
                defaultRoundDP: defaultRoundDP,
                dpRound: dpRound
            };
            return service;
            ///////////////////////////

            // utility function to round numbers to various decimal places
            function dpRound(val, decimalPlaces) {
                var exp = Math.pow(10, decimalPlaces);
                var rslt = Math.round(val, exp) / exp;
                if (Math.abs(rslt) === 0) {
                    rslt = Math.abs(rslt);
                }
                return rslt;
            }

            //validates the inputs used by this service consisting of a BMP property bag and
            //a design complexity property bag. Delegates validation of design complexity to appropriate service
            function validateInputs(inputType, inputs) {
                switch (inputType) {
                    case 'BMP':
                        return validateBMPInputs(inputs);
                        break;
                    case 'Complexity':
                        return designComplexity.validateInputs(inputs);
                        break;
                    default:
                        return false;
                }
            }

            //validates BMP property bag passed in as inputs to the cost engine service
            function validateBMPInputs(options) {
                var flag = false;
                options = angular.extend({}, defaultBMPProps, options);
                flag = (typeof (options.footprintAreaSqFt) === 'number' && options.bmpType > -1 && options.bmpType < 8); //check for valid BMP type

                flag = flag && (options.footprintAreaSqFt !== undefined && typeof (options.footprintAreaSqFt) === 'number' &&
                        options.footprintAreaSqFt >= 0);
                flag = flag && (options.capacityVolGals !== undefined && typeof (options.capacityVolGals) === 'number' &&
                        options.capacityVolGals >= 0);
                return flag;
            }

            //utility function that valides arguments are numeric 
            function validateNumeric(options) {
                var flag = true;
                $.each(options, function (idx, val) {
                    flag = flag && (typeof (val) === 'number');
                });
                return flag;
            }

            //function to parse linear regression equations to isolate slope and intercept
            function parseLinearEqn(eqnstr) {
                var slope = -1;
                var intercept = -1;
                var rsltFail = {status: false, slope: -1, intercept: -1};
                var startTokens = 'y=';
                var delim = '-';
                var temparr = [];
                if (eqnstr.indexOf("+") > 1) {
                    delim = '+';
                }
                if (eqnstr.indexOf("x") < 1 || eqnstr.indexOf('y') < 0) {
                    return rsltFail;
                }

                temparr = eqnstr.replace(/ /g, '').replace(startTokens, '').split(delim);
                try {
                    slope = Number(temparr[0].substring(0, temparr[0].length - 1));
                    if (temparr.length > 1) {
                        intercept = Number(temparr[1]);
                    } else {
                        intercept = 0;
                    }
                } catch (error) {
                    console.log(error);
                    return rsltFail;
                }
                return {status: true, slope: slope, intercept: intercept};
            }

            //Computes cost given cost curve, intercept, slope, inflation factor and regional adjustment factor
            function computeCost(bmpSize, ccIntercept, ccSlope, inflation, regionalFactor) {
                var flag = validateNumeric([bmpSize, ccIntercept, ccSlope, inflation, regionalFactor]);
                if (flag) {
                    return dpRound(bmpSize * ccIntercept * ccSlope * inflation * regionalFactor, defaultRoundDP);
                } else {
                    return flag;
                }
            }

            //TODO write tests
            function computeLIDCtrlCost(lid, inflation, regionalFactor) {
                var costEqn = {};

                switch (lid.type) {
                    case 0: //DC
                        lid.costQty = lid.footprintAreaSqFt;
                        break;
                    case 1: //RG
                        lid.costQty = lid.footprintAreaSqFt;
                        break;
                }
                //compute capital cost
                costEqn = parseLinearEqn(lid.costData.capital);
                lid.capCost = computeCost(lid.costQty, costEqn.intercept, costEqn.slope, inflation, regionalFactor);

                //compute maintenance cost
                costEqn = parseLinearEqn(lid.costData.maintenance);
                lid.maintCost = computeCost(lid.costQty, costEqn.intercept, costEqn.slope, inflation, regionalFactor);

            }

            //TODO write tests
            function computeLIDCtrlCosts(lidObjs, inflation, regionalFactor) {
                $.each(lidObjs, function (idx, val) {
                    computeLIDCtrlCost(val, inflation, regionalFactor);
                });
            }
        })
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
                computeDesignComplexity: computeDesignComplexity
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
