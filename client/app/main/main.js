'use strict';

angular.module('amonalieApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/trella', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        authenticate: true
      });
  });
