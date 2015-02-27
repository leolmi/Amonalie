/**
 * Created by Leo on 22/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('AmonaliaModalCtrl', ['$scope','Amonalies','Logger', function ($scope,Amonalies,Logger) {
    $scope.collapsed = true;
    $scope.states = Amonalies.states();
    $scope.addItem = function () {
      //TODO: aggiunge un nuovo task
      Logger.info('Aggiunge un nuovo task','(da implementare)');
    };
  }]);
