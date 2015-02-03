'use strict';

angular.module('amonalieApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl',
        authenticate: true
      });
  });
