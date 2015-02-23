/**
 * Created by Leo on 23/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/actions', {
        templateUrl: 'app/actions/actions.html',
        controller: 'ActionsCtrl',
        authenticate: true
      });
  });
