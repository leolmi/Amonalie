/**
 * Created by Leo on 05/03/2015.
 */
'use strict';

angular.module('amonalieApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/table/table.html',
        controller: 'TableCtrl',
        authenticate: true
      });
  });
