/**
 * Created by Leo on 19/02/2015.
 */
'use strict';

angular.module('amonalieApp')
    .controller('TargetModalCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.options = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.opened = false;

    $scope.open = function(e) {
      e.preventDefault();
      e.stopPropagation();
      $scope.opened = !$scope.opened;
    };

    $scope.toggle = function() {
      $scope.$parent.modal.clone.active = !$scope.$parent.modal.clone.active;
    };


    //var getDate = function() {
    //  var d = $scope.$parent.modal.clone.date;
    //  alert('data originale:')
    //  if (!d) d = new Date();
    //  return d.getDate()+'/'+(d.getMonth()+1)+'/'+ d.getFullYear();
    //}
    //
    //$scope.dt = getDate();

    $scope.format = 'dd/MM/yyyy';

    $scope.debug = $scope.$parent.modal.clone;

  }]);
