/**
 * Created by Leo on 22/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('taskItem', ['$location', function ($location) {
    return {
      restrict: 'E',
      scope: {task: '=ngModel'},
      templateUrl: 'components/task/task-item.html',
      link: function (scope, elm, atr) {
        scope.getDate = function(n) {
          var d = new Date(n);
          return d.getDate()+'/'+(d.getMonth()+1)+'/'+ d.getFullYear();
        };
      }
    }
  }]);
