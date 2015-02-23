/**
 * Created by Leo on 22/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('TaskModalCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.collapsed = true;
    $scope.states = ['dafare','fando','fatto'];
    $scope.addItem = function () {
      //TODO: aggiunge un nuovo task
      alert('Aggiunge un nuovo task');
    };
  }]);
