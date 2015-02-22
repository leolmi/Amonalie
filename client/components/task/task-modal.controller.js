/**
 * Created by Leo on 22/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('TaskModalCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.collapsed = true;
    $scope.states = ['dafare','fando','fatto'];
    $scope.getDate = function(n) {
      var d = new Date(n);
      return d.getDate()+'/'+(d.getMonth()+1)+'/'+ d.getFullYear();
    };
  }]);
