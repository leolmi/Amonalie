/**
 * Created by Leo on 27/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('AmonalieListCtrl', ['$scope','cache','Amonalies', function ($scope,cache,Amonalies) {
    $scope.states = Amonalies.states();
    $scope.getCodes = function(amonalies) {
      var codes = '';
      amonalies.forEach(function(a){
        codes+= a.code+',';
      })
      return codes;
    };
    $scope.targets = cache.context.targets;
    $scope.items = [{
      title:'Passaggio di stato'
    },{
      title:'Imposta obiettivo',
      desc:'Imposta l\'obiettivo selezionato su tutte le attività in corso nelle amonalie selezionate.'
    },{
      title:'Archivia',
      desc:'Archivia tutte le anomalie selezionate.\r\nNel farlo chiude tutte le eventuali attività aperte.'
    }];
    $scope.setPage = function(index) {
      $scope.modal.info.action = index;
    };
  }]);
