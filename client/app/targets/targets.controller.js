/**
 * Created by Leo on 10/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('TargetsCtrl', ['$scope','$http','socket','Amonalies', function ($scope, $http, socket, Amonalies) {
    $scope.waiting = true;
    Amonalies.get(function(amonalies, targets) {
      $scope.amonalies = amonalies;
      $scope.targets = targets;
      socket.syncUpdates('amonalie', $scope.amonalies);
      socket.syncUpdates('target', $scope.targets);
      $scope.waiting = false;
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('amonalie');
      socket.unsyncUpdates('target');
    });

    $scope.newTarget = function() {
      //TODO: dovrebbe aprire l'editor del target, non crearlo direttamente
      $http.post('/api/targets', { name: 'Nuovo obiettivo', active:true });
    };

  }]);
