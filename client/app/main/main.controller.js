'use strict';

angular.module('amonalieApp')
  .controller('MainCtrl', ['$scope', '$http', 'socket', 'Amonalies', function ($scope, $http, socket, Amonalies) {
    $scope.undefinedTasks = { title:'Anomalie', filter:undefined, style:'primary' };
    $scope.todoTasks = { title:'Da fare', filter:'dafare', style:'danger' };
    $scope.doingTasks = { title:'Fando', filter:'fando', style:'warning' };
    $scope.closedTasks = { title:'Fatte', filter:'fatto', style:'success' };

    Amonalies.get(function(amonalies) {
      $scope.amonalies = amonalies;
    });

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
