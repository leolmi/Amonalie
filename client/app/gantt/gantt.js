/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/gantt', {
        templateUrl: 'app/gantt/gantt.html',
        controller: 'GanttCtrl',
        authenticate: true
      });
  });
