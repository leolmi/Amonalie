'use strict';

angular.module('amonalieApp')
  .controller('MainCtrl', ['$scope','$q','$http','$window','socket','Logger','Amonalies','cache', function ($scope, $q, $http, $window, socket, Logger, Amonalies, cache) {
    $scope.context = cache.context;
    cache.init();
    $scope.groups = [
      { title:'Anomalie', filter:undefined, style:'primary', filtername:'amonalies' },
      { title:'Da fare', filter:'dafare', style:'danger', filtername:'dafare' },
      { title:'Fando', filter:'fando', style:'warning', filtername:'fando' },
      { title:'Fatte', filter:'fatto', style:'success', filtername:'fatto' }
    ];
    function newAmonalia(){
      Amonalies.createAmonalia();
    }

    function filterEditor() {
      //TODO: Imposta i filtri globali
      Logger.info('Imposta i filtri globali','(da implementare)');
    }

    function handleSelection() {
      //var selection = [];
      //cache.context.amonalies.forEach(function(a){
      //  if (a.selected)
      //    selection.push(a);
      //});
      Amonalies.handleSelection(cache.context.o.selection);
    }

    $scope.buttons = [{
      desc:'Gestisci selezione multipla',
      class:'fa-play-circle',
      click: handleSelection
    },{
      divider: true
    },{
      desc:'Imposta i filtri globali',
      class:'fa-filter',
      click: filterEditor
    },{
      desc:'Crea una nuova amonalia',
      class:'fa-plus-circle',
      click: newAmonalia
    }];

    $scope.activetab = $scope.groups[0].title;

    $scope.dragging = false;

    var win = angular.element($window);

    var checkSize = function(){
      $scope.large = (win.width() > 767);
    };
    win.bind('resize',function(){
      checkSize();
      $scope.$apply();
    });
    checkSize();

    $scope.selectTab = function(name) {
      $scope.activetab = name;
    };

    //$scope.awesomeThings = [];
    //
    //$http.get('/api/things').success(function(awesomeThings) {
    //  $scope.awesomeThings = awesomeThings;
    //  socket.syncUpdates('thing', $scope.awesomeThings);
    //});
    //
    //$scope.addThing = function() {
    //  if($scope.newThing === '') {
    //    return;
    //  }
    //  $http.post('/api/things', { name: $scope.newThing });
    //  $scope.newThing = '';
    //};
    //
    //$scope.deleteThing = function(thing) {
    //  $http.delete('/api/things/' + thing._id);
    //};
    //
    //$scope.$on('$destroy', function () {
    //  socket.unsyncUpdates('thing');
    //});

    $scope.beforeDrop = function(event, ui, t) {
      var deferred = $q.defer();
      if (t.filter==Amonalies.dragging.a.state)
        deferred.reject();
      else {
        var opt = {
          state: t.filter,
          def: deferred
        };
        Amonalies.editAmonalia(Amonalies.dragging.a, opt);
      }
      return deferred.promise;
    };
  }]);
