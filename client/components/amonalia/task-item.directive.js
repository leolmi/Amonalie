/**
 * Created by Leo on 22/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('taskItem', ['cache','Utilities','Amonalies', function (cache,Utilities,Amonalies) {
    return {
      restrict: 'E',
      scope: {task: '=ngModel', readonly:'=', collapsed:'='},
      templateUrl: 'components/amonalia/task-item.html',
      link: function (scope, elm, atr) {
        scope.options = {
          formatYear: 'yy',
          startingDay: 1
        };
        scope.format = 'dd/MM/yyyy';

        scope.task.dates = {
          start: scope.task.start,
          end: scope.task.end ? scope.task.end : undefined
        };
        scope.targets = cache.context.targets;
        scope.start_opened = false;
        scope.end_opened = false;
        var now = (new Date()).getTime();
        scope.done = scope.task && scope.task.start && scope.task.end && scope.task.end<now;
        Amonalies.getUsers(function(users) {
          scope.users = users;
        });


        function getDate(n) {
          var d = new Date(n);
          return d.getDate()+'/'+(d.getMonth()+1)+'/'+ d.getFullYear();
        }


        scope.getUserName = function(){
          if (scope.users)
            return Amonalies.getUserName(scope.users, scope.task.owner);
          return 'non definito';
        };
        scope.getTimeDesc = function() {
          var times = 'tempi non definiti';
          if (scope.task.start) {
            times = 'dal '+getDate(scope.task.start);
            if (scope.task.end)
              times += ' al '+getDate(scope.task.end);
          }
          else if (scope.task.end) {
            times = 'entro il '+getDate(scope.task.end);
          }
          return times;
        };

        scope.toggle = function() {
          scope.collapsed=!scope.collapsed;
        };
        scope.delete = function() {
          var idx = scope.$parent.modal.info.a.tasks.indexOf(scope.task);
          scope.$parent.modal.info.a.tasks.splice(idx,1);
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
          var now = (new Date()).getTime();
          if (!scope.task_dates.start)
            scope.task_dates.start = now;
          if (!scope.task_dates.end)
            scope.task_dates.end = now;
        };
      }
    }
  }]);
