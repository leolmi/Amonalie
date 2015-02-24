'use strict';

angular.module('amonalieApp')
  .controller('MainCtrl', ['$scope','$q','$http','$window','socket','Modal','Amonalies','cache', function ($scope, $q, $http, $window, socket, Modal, Amonalies, cache) {
    $scope.context = cache.context;
    cache.init();
    $scope.taskGroups = [
      { title:'Anomalie', filter:undefined, style:'primary', filtername:'amonalies' },
      { title:'Da fare', filter:'dafare', style:'danger', filtername:'dafare' },
      { title:'Fando', filter:'fando', style:'warning', filtername:'fando' },
      { title:'Fatte', filter:'fatto', style:'success', filtername:'fatto' }
    ];

    $scope.activetab = $scope.taskGroups[0].title;

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

    $scope.newAmonalia = function(){
      //TODO: Crea una nuova amonalia
      alert('Crea una nuova amonalia [da implementare]!');
    };
  }]);
