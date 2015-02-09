'use strict';

angular.module('amonalieApp')
  .controller('MainCtrl', ['$scope', '$http', '$window', 'socket', 'Amonalies', function ($scope, $http, $window, socket, Amonalies) {
    $scope.taskGroups = [
      { title:'Anomalie', filter:undefined, style:'primary' },
      { title:'Da fare', filter:'dafare', style:'danger' },
      { title:'Fando', filter:'fando', style:'warning' },
      { title:'Fatte', filter:'fatto', style:'success' }
    ];

    //$scope.undefinedTasks = { title:'Anomalie', filter:undefined, style:'primary' };
    //$scope.todoTasks = { title:'Da fare', filter:'dafare', style:'danger' };
    //$scope.doingTasks = { title:'Fando', filter:'fando', style:'warning' };
    //$scope.closedTasks = { title:'Fatte', filter:'fatto', style:'success' };
    $scope.activetab = $scope.taskGroups[0].title;


    Amonalies.get(function(amonalies) {
      $scope.amonalies = amonalies;
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
      $scope.$apply();
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
  }]);
