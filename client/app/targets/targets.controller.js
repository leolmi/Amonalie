/**
 * Created by Leo on 10/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('TargetsCtrl', ['$scope','$http','socket','Amonalies', function ($scope, $http, socket, Amonalies) {
    Amonalies.get(function(amonalies, targets) {
      $scope.amonalies = amonalies;
      $scope.targets = targets;
      socket.syncUpdates('amonalie', $scope.amonalies);
      socket.syncUpdates('target', $scope.targets);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('amonalie');
      socket.unsyncUpdates('target');
    });

  }]);
