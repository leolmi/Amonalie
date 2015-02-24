/**
 * Created by Leo on 10/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('TargetsCtrl', ['$scope','Auth','cache','Amonalies', function ($scope,Auth,cache,Amonalies) {
    $scope.context = cache.context;

    function newTarget() {
      Amonalies.createNewTarget();
    }

    function toggleMine() {
      cache.context.o.targets.mine = !cache.context.o.targets.mine;
      //TODO: filtro sugli obiettivi personali
      alert('Filtra gli obiettivi personali [da implementare]!')
      $scope.buttons[0].checked = cache.context.o.targets.mine;
    }

    $scope.newT = function() { newTarget() };

    $scope.buttons = [{
      desc:'Visualizza solo i miei obiettivi',
      class:'fa-user',
      checked: cache.context.o.targets.mine,
      click: toggleMine
    },{
      desc:'Crea un nuovo obiettivo',
      class:'fa-plus-circle',
      click: newTarget
    }];
  }]);
