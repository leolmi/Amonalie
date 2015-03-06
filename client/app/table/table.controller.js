/**
 * Created by Leo on 05/03/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('TableCtrl', ['$scope','cache','Amonalies','Logger', function ($scope,cache,Amonalies,Logger) {
    $scope.context = cache.context;
    cache.check();

    function filter(){
      //TODO: Gestisce i filtri avanzati
      Logger.info('Gestisce i filtri avanzati','(da implementare)');
    }

    function toggleMine(){
      cache.context.o.table.mine = !cache.context.o.table.mine;
      //TODO: Visualizza solo le segnalazioni assegnate a me
      Logger.info('Visualizza solo le segnalazioni assegnate a me','(da implementare)');
      $scope.buttons[4].checked = cache.context.o.table.mine;
    }

    function newAmonalia(){
      Amonalies.createAmonalia();
    }

    function handleSelection(){
      Amonalies.handleSelection(cache.context.o.selection);
    }

    function clearSelection(){
      cache.context.o.selection = [];
    }

    function isNotSelection(){
      return cache.context.o.selection.length<=0;
    }

    $scope.buttons = [{
      desc:'Cancella selezione',
      class:'fa-trash',
      click: clearSelection,
      hiddenon: isNotSelection
    },{
      desc:'Gestisci selezione multipla',
      class:'fa-play-circle',
      click: handleSelection,
      hiddenon: isNotSelection
    },{
      divider: true,
      hiddenon: isNotSelection
    },{
      desc:'Filtri avanzati',
      class:'fa-filter',
      click: filter
    },{
      desc:'Mostra solo le amonalie assegnate a me',
      class:'fa-user',
      checked: cache.context.o.table.mine,
      click: toggleMine
    },{
      desc:'Crea una nuova amonalia',
      class:'fa-plus-circle',
      click: newAmonalia
    }];

    $scope.columns = [{
      title: 'Codice',
      name:'code',
      width:100
    },{
      title: 'Applicazione',
      name:'app',
      width:250
    },{
      title: 'Oggetto',
      name:'obj',
      width:400
    },{
      title: 'Stato',
      name:'state',
      width:100
    },{
      title: 'Descrizione',
      name:'desc',
      width:800
    }];

    $scope.columnClick = function(c){
      if ($scope.context.o.table.col && c.name==$scope.context.o.table.col.name)
        $scope.context.o.table.rev = $scope.context.o.table.rev ? false : true;
      else {
        $scope.context.o.table.col = c;
        $scope.context.o.table.rev = false;
        $scope.context.o.table.exp = c.name;
      }
    };

    $scope.isSelected = function(a) { return (cache.context.o.selection.indexOf(a)>=0); };

    $scope.getStyle = function(a){
      var s = {};
      if (cache.context.o.selection.indexOf(a)>=0){
        s['row-selected']=true;
      }
      else if (a.archived) {
        s['row-archived']=true;
      }
      else {
        switch (a.state) {
          case 'fatto': s['row-success']=true; break;
          case 'fando': s['row-warning']=true; break;
          case 'dafare': s['row-danger']=true; break;
        }
      }
      return s;
    };

    $scope.select = function(a) {
      cache.select(a);
    };

    $scope.getSelectionCodes = function() {
      var codes = '';
      cache.context.o.selection.forEach(function(a){
        codes+= a.code+',';
      });
      return codes;
    };

    $scope.edit = function(e, a){
      e.preventDefault();
      e.stopPropagation();
      Amonalies.editAmonalia(a);
    };
  }]);
