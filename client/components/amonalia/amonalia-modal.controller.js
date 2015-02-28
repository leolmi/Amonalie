/**
 * Created by Leo on 22/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('AmonaliaModalCtrl', ['$scope','Auth','Amonalies', function ($scope,Auth,Amonalies) {
    $scope.collapsed = true;
    $scope.states = Amonalies.states();
    $scope.addItem = function () {
      var t = Amonalies.getNewTask(Auth.getCurrentUser()._id);
      $scope.modal.info.a.tasks.push(t);
    };
  }]);
