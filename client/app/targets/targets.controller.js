/**
 * Created by Leo on 10/02/2015.
 */
'use strict';

angular.module('amonalieApp')
    .controller('TargetsCtrl', ['$scope','$http','Amonalies', function ($scope, $http, Amonalies) {
      Amonalies.get(function(amonalies) {
        $scope.amonalies = amonalies;
      });

      Amonalies.useTargets(function(targets){
        $scope.targets = targets;
      });

    }]);
