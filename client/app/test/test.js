/**
 * Created by Leo on 26/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/test', {
        templateUrl: 'app/test/test.html',
        controller: 'TestCtrl',
        authenticate: true
      });
  });
