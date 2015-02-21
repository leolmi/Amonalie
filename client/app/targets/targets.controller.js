/**
 * Created by Leo on 10/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('TargetsCtrl', ['$scope','$http','socket','Auth','Amonalies', function ($scope, $http, socket, Auth, Amonalies) {
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
      var target = {
        name: 'Nuovo obiettivo',
        info: '',
        author: Auth.getCurrentUser()._id,
        active: true,
        date: (new Date()).getTime()
      };
      Amonalies.editTarget(target);
    };
  }]);
