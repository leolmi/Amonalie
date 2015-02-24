/**
 * Created by Leo on 22/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('taskItem', ['Logger', function (Logger) {
    return {
      restrict: 'E',
      scope: {task: '=ngModel', targets:'=', readonly:'='},
      templateUrl: 'components/task/task-item.html',
      link: function (scope, elm, atr) {
        scope.options = {
          formatYear: 'yy',
          startingDay: 1
        };
        scope.format = 'dd/MM/yyyy';
        scope.task_dates = {
          start: scope.task.start,
          end: scope.task.end ? scope.task.end : undefined
        };
        scope.start_opened = false;
        scope.end_opened = false;
        scope.collapsed = true;
        scope.done = scope.task && scope.task.start && scope.task.end;
        scope.getDate = function(n) {
          var d = new Date(n);
          return d.getDate()+'/'+(d.getMonth()+1)+'/'+ d.getFullYear();
        };
        scope.toggle = function() {
          scope.collapsed=!scope.collapsed;
        };
        scope.delete = function() {
          //TODO: elimina il task
          Logger.info('Elimina il task','(da implementare)');
        };
        scope.open_start = function(e) {
          e.preventDefault();
          e.stopPropagation();
          scope.start_opened = !scope.start_opened;
        };
        scope.open_end = function(e) {
          e.preventDefault();
          e.stopPropagation();
          scope.end_opened = !scope.end_opened;
        };
        scope.terminate = function() {

        };
      }
    }
  }]);
