'use strict';

angular.module('amonalieApp')
  .controller('MainCtrl', ['$scope','$q','$http','$window','socket','Modal','Amonalies', function ($scope, $q, $http, $window, socket, Modal, Amonalies) {
    $scope.waiting = true;
    $scope.taskGroups = [
      { title:'Anomalie', filter:undefined, style:'primary' },
      { title:'Da fare', filter:'dafare', style:'danger' },
      { title:'Fando', filter:'fando', style:'warning' },
      { title:'Fatte', filter:'fatto', style:'success' }
    ];

    $scope.activetab = $scope.taskGroups[0].title;

    $scope.dragging = false;

    Amonalies.get(function(amonalies) {
      $scope.amonalies = amonalies;
      $scope.waiting = false;
    });

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
      //$scope.$apply();
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


    var modalSetState = Modal.confirm.edittask(function(dragging, deferred) {
      Amonalies.updateAmonalia(dragging.a, function() {
        deferred.resolve();
      });
    });

    $scope.beforeDrop = function(event, ui, t) {
      var deferred = $q.defer();
      if (t.filter==Amonalies.dragging.a.state)
        deferred.reject();
      else {
        Amonalies.dragging.state = t.filter;
        Amonalies.dragging.title = 'Assegna amonalia: '+ Amonalies.dragging.a.code;
        modalSetState(Amonalies.dragging, deferred);
      }
      return deferred.promise;
    };
  }]);
