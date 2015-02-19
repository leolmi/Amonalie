/**
 * Created by Leo on 10/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('TargetsCtrl', ['$scope','$http','socket','Amonalies','Modal', function ($scope, $http, socket, Amonalies, Modal) {
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

    var modalEdit = Modal.confirm.edittarget();

    $scope.newTarget = function() {
      //TODO: dovrebbe aprire l'editor del target, non crearlo direttamente

      var target = {
        name: 'Nuovo obiettivo',
        info: '',
        active: true,
        date: new Date()
      };

      var info = {
        title:'Nuovo Obiettivo',
        target:target
      }

      modalEdit(info);
      //$http.post('/api/targets', { name: 'Nuovo obiettivo', active:true });
    };

  }]);
