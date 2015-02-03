'use strict';

angular.module('amonalieApp')
  .controller('MainCtrl', ['$scope', '$http', 'socket', '$interval', 'uiGridConstants', function ($scope, $http, socket, $interval, uiGridConstants) {

    $scope.columns = [
      {title:'#', name:'n'},
      {title:'Name', name:'name'},
      {title:'Value', name:'value'},
      {title:'Code', name:'code'}
    ];
    $scope.rows = [
      {n:'1', name:'uno',value:'due',code:'tre' },
      {n:'2', name:'asdf',value:'12',code:'rt' },
      {n:'3', name:'sfg',value:'346',code:'dhfgd' },
      {n:'4', name:'fg',value:'15',code:'tradge' },
      {n:'5', name:'fgjfghj',value:'125',code:'agdgafdgafdg' }
    ];



    //$scope.gridOptions = {
    //  enableFiltering: true,
    //  useExternalFiltering: true,
    //  columnDefs: [
    //    { name: 'name', enableFiltering: false },
    //    { name: 'gender' },
    //    { name: 'company', enableFiltering: false}
    //  ],
    //  onRegisterApi: function( gridApi ) {
    //    $scope.gridApi = gridApi;
    //    $scope.gridApi.core.on.filterChanged( $scope, function() {
    //      var grid = this.grid;
    //      if( grid.columns[1].filters[0].term === 'male' ) {
    //        $http.get('/data/100_male.json')
    //          .success(function(data) {
    //            $scope.gridOptions.data = data;
    //          });
    //      } else if ( grid.columns[1].filters[0].term === 'female' ) {
    //        $http.get('/data/100_female.json')
    //          .success(function(data) {
    //            $scope.gridOptions.data = data;
    //          });
    //      } else {
    //        $http.get('/data/100.json')
    //          .success(function(data) {
    //            $scope.gridOptions.data = data;
    //          });
    //      }
    //    });
    //  }
    //};

    //$http.get('/data/100.json')
    //  .success(function(data) {
    //    $scope.gridOptions.data = data;
    //  });


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
