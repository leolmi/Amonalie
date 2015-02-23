/**
 * Created by Leo on 23/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('ActionsCtrl', ['$scope','$http','socket', function ($scope, $http, socket) {
    $scope.waiting = true;
    $http.get('/api/actions')
      .success(function(actions){
        $scope.actions = actions;
        socket.syncUpdates('action', $scope.actions);
      })
      .error(function(err){
        Logger.error('Errori nella ricezione degli eventi!', JSON.stringify(err));
      })
      .then(function(){
        $scope.waiting = false;
      });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('action');
    });
  }]);
