/**
 * Created by Leo on 10/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/targets', {
        templateUrl: 'app/targets/targets.html',
        controller: 'TargetsCtrl',
        authenticate: true
      });
  });
