/**
 * Created by Leo on 26/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('TestCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.elements = [];
    $scope.element = {color:'white'};
    $scope.addElement = function() {
      $scope.elements.push({color:$scope.element.color});
    };
    $scope.getElementStyle = function() {
      return {'background-color':$scope.element.color};
    };
    $scope.getStyle = function(index) {
      if ($scope.elements.length)
        return {'background-color':$scope.elements[index].color};
    };
    $scope.delete =  function(index) {
      $scope.elements.splice(index, 1);
    };
  }]);
