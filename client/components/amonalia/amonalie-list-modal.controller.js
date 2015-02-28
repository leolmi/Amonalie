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
    Amonalies.getUsers(function(users){
      $scope.users = users;
    });
    $scope.items = [{
      title:'Passaggio di stato',
      desc: 'Passa di stato le amonalie selezionate.'
    },{
      title:'Imposta obiettivo',
      desc:'Imposta l\'obiettivo selezionato su tutte le attività in corso nelle amonalie selezionate.'
    },{
      title:'Archivia',
      desc:'Archivia tutte le amonalie selezionate.\r\nNel farlo chiude tutte le eventuali attività aperte.'
    }];
    $scope.options = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.format = 'dd/MM/yyyy';
    $scope.start_opened = false;
    $scope.setPage = function(index) {
      $scope.modal.info.action = index;
    };
    $scope.getStateDesc = function() {
      switch($scope.modal.info.o.state) {
        case 'fatto': return 'Chiude le attività rimaste aperte e passa le amonalie allo stato "fatto"';
        default: return 'Se non esiste già crea un nuovo intervento con le specifiche indicate.\r\nSe già presente aggiorna i campi non valorizzati.';
      }
    };
    $scope.open_start = function(e) {
      e.preventDefault();
      e.stopPropagation();
      $scope.start_opened = $scope.start_opened ? false : true;
    };
  }]);
