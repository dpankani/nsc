angular.module('nscwebappApp.controllers', [])
        //side menu controller
        .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        })
        //main view controller
        .controller('MainCtrl', function (designComplexity, costEngineSrvc, chartengine) {
            var vm = this;
            vm.pageTitle = 'Estimate of Probable Capital Costs';

            vm.showTabular = true;
            vm.showGraphical = !vm.showTabular;

            vm.showCap = true;
            vm.showMaint = !vm.showCap;

            vm.showCapitalGraphical = true;
            vm.showCapitalTabular = true;
            vm.showMaintGraphical = true;
            vm.showMaintTabular = true;

            //TODO replace mock data with computed data
            vm.estimatedResults = [
                {id: 'DC', name: 'Disconnection', baseCapLow: '$100', baseCapHigh: '$200', baseMaintLow: '$325', baseMaintHigh: '$575', currentCapLow: '$100', currentCapHigh: '$200', currentMaintLow: '$325', currentMaintHigh: '$575'},
                {id: 'RH', name: 'Rainwater Harvesting', baseCapLow: '$100', baseCapHigh: '$200', baseMaintLow: '$325', baseMaintHigh: '$575', currentCapLow: '$100', currentCapHigh: '$200', currentMaintLow: '$325', currentMaintHigh: '$575'},
                {id: 'RG', name: 'Rain Gardens', baseCapLow: '$100', baseCapHigh: '$200', baseMaintLow: '$325', baseMaintHigh: '$575', currentCapLow: '$100', currentCapHigh: '$200', currentMaintLow: '$325', currentMaintHigh: '$575'},
                {id: 'GR', name: 'Green Roofs', baseCapLow: '$100', baseCapHigh: '$200', baseMaintLow: '$325', baseMaintHigh: '$575', currentCapLow: '$100', currentCapHigh: '$200', currentMaintLow: '$325', currentMaintHigh: '$575'},
                {id: 'SP', name: 'Street Planters', baseCapLow: '$100', baseCapHigh: '$200', baseMaintLow: '$325', baseMaintHigh: '$575', currentCapLow: '$100', currentCapHigh: '$200', currentMaintLow: '$325', currentMaintHigh: '$575'},
                {id: 'IB', name: 'Infiltration Basins', baseCapLow: '$100', baseCapHigh: '$200', baseMaintLow: '$325', baseMaintHigh: '$575', currentCapLow: '$100', currentCapHigh: '$200', currentMaintLow: '$325', currentMaintHigh: '$575'},
                {id: 'PP', name: 'Permeable Pavement', baseCapLow: '$100', baseCapHigh: '$200', baseMaintLow: '$325', baseMaintHigh: '$575', currentCapLow: '$100', currentCapHigh: '$200', currentMaintLow: '$325', currentMaintHigh: '$575'},
                {id: 'VS', name: 'Vegetated Swales', baseCapLow: '$100', baseCapHigh: '$200', baseMaintLow: '$325', baseMaintHigh: '$575', currentCapLow: '$100', currentCapHigh: '$200', currentMaintLow: '$325', currentMaintHigh: '$575'}
            ];

            vm.toggleGraphicalView = toggleGraphicalView;
            vm.toggleCapMaintViews = toggleCapMaintViews;

            /* Begin function definitions */
            /***************************/
            function toggleGraphicalView(show) {
                vm.showTabular = show;
                vm.showGraphical = !vm.showTabular;
            }
            function toggleCapMaintViews(show) {
                vm.showCap = show;
                vm.showMaint = !vm.showCap;
                if(show){
                    vm.pageTitle = 'Estimate of Probable Capital Costs';
                }else{
                    vm.pageTitle = 'Estimate of Probable Maintenance Costs';
                }
            }

            /* Begin excution */
            /***************************/
            chartengine.mockupCharts();
        })
        .filter('offset', function () {
            return function (input, start) {
                start = parseInt(start, 10);
                return input.slice(start);
            };
        });
