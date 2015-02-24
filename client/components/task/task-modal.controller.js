/**
 * Created by Leo on 22/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('TaskModalCtrl', ['$scope', 'Logger', function ($scope, Logger) {
    $scope.collapsed = true;
    $scope.states = ['dafare','fando','fatto'];
    $scope.addItem = function () {
      //TODO: aggiunge un nuovo task
      Logger.info('Aggiunge un nuovo task','(da implementare)');
    };
  }]);
