'use strict';
/**
 * @ngdoc service
 * @name nscwebappApp.chartengine
 * @description
 * # chartengine
 * Service in the nscwebappApp.
 */

/*
 DC	RH	RG	GR	SP	IB	PP	VS
 $81,537 	 $146,123 	 $103,596 	 $207,989 	 $214,420 	 $313,734 	 $894,613 	 $114,641 
 $1,388,914 	 $296,042 	 $599,960 	 $953,620 	 $1,033,349 	 $325,847 	 $1,795,732 	 $216,514 
 */

//error bars code http://qiita.com/ku0522a/items/19934339c69037171b31
angular.module('nscwebappApp')
        .service('chartengine', function () {

            //    var bmpTypes = ['Disconnection', 'Rain Harvesting','Rain Gardens',
            //'Green Roofs','Street Planters','Infiltration Basins','Permeable Pavement', 'Vegetated Swale'];
            var costData = {
                DC: {
                    capital: {amount: 81537, complexity: 1},
                    maintenance: {amount: 100, complexity: -1},
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
                    maintenance: {amount: 100, complexity: -1},
                },
                PP: {
                    capital: {amount: 894613, complexity: 1},
                    maintenance: {amount: 100, complexity: -1},
                },
                VS: {
                    capital: {amount: 114641, complexity: 1},
                    maintenance: {amount: 100, complexity: -1},
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
                //1. generate baseline / alternative pie chart - capital cost - $
                //var bc1 = generateChart('#bc-pie-dollar', chartTypes.donut, chartData.capital, chartTitles.baseline, dollarLabelFormatFxn);
                //var bc2 = generateChart('#ac-pie-dollar', chartTypes.donut, chartData.capital, chartTitles.current, dollarLabelFormatFxn);

                //2. generate baseline / alternative pie chart - capital cost - ratio
                //var bc3 = generateChart('#bc-pie', chartTypes.donut, chartData.capital, chartTitles.baseline, undefined);
                //var bc4 = generateChart('#ac-pie', chartTypes.donut, chartData.capital, chartTitles.current, undefined);

                //3. generate baseline bar chart - capital cost
                var bc5 = generateChart('#bc-bar', chartTypes.bar, chartData.capital, chartData.capitalErrors);
                var bc6 = generateChart('#ac-bar', chartTypes.bar, chartData.capital, chartData.capitalErrors);


                //begin maintenance cost charts
                //1. generate baseline / alternative pie chart - capital cost - $
                //var bm1 = generateChart('#bm-pie-dollar', chartTypes.donut, chartData.capital, chartTitles.baseline, dollarLabelFormatFxn);
                //var bm2 = generateChart('#am-pie-dollar', chartTypes.donut, chartData.capital, chartTitles.current, dollarLabelFormatFxn);

                //2. generate baseline / alternative pie chart - capital cost - ratio
                //var bm3 = generateChart('#bm-pie', chartTypes.donut, chartData.capital, chartTitles.baseline, undefined);
                //var bm4 = generateChart('#am-pie', chartTypes.donut, chartData.capital, chartTitles.current, undefined);

                //3. generate baseline bar chart - capital cost
                var bm5 = generateChart('#bm-bar', chartTypes.bar, chartData.capital, chartData.capitalErrors);
                var bm6 = generateChart('#am-bar', chartTypes.bar, chartData.capital, chartData.capitalErrors);

                /*var maintenanceCharts = [bm1,bm2,bm3, bm4,bm5,bm6];
                 $.each(maintenanceCharts, function (idx, val) {
                 val.colorPattern = ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#005a32'];
                 });*/

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
                        pattern: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#4C6C84'] //, '#0c2c84'
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
        });
