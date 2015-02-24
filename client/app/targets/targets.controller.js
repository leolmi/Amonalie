/**
 * Created by Leo on 10/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('TargetsCtrl', ['$scope','Auth','cache','Amonalies', function ($scope,Auth,cache,Amonalies) {
    $scope.context = cache.context;

    $scope.newTarget = function() {
      Amonalies.createNewTarget();
    };

    $scope.toggleMine = function() {
      cache.context.o.targets.mine = !cache.context.o.targets.mine;
      //TODO: filtro sugli obiettivi personali
      alert('Filtra gli obiettivi personali [da implementare]!')
    };
  }]);
