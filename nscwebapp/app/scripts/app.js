'use strict';

/**
 * @ngdoc overview
 * @name nscwebappApp
 * @description
 * # nscwebappApp
 *
 * Main module of the application.
 */
angular
  .module('nscwebappApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/caprsltsgraph', {
        templateUrl: 'views/caprsltsgraph.html',
        controller: 'CaprsltsgraphCtrl',
        controllerAs: 'caprsltsgraph'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
