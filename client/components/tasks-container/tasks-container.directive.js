/**
 * Created by Leo on 03/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('tasksContainer', ['cache','Amonalies',function(cache,Amonalies) {
    return {
      restrict: 'E',
      scope: {tasks: '=ngModel', amonalies:'=', showtitle:'='},
      templateUrl: 'components/tasks-container/tasks-container.html',
      link: function (scope, elm, atr) {
        scope.startDrag = function(event, ui, a) {
          Amonalies.dragging = {
            a: a
          };
        };
        scope.filters = cache.context.o.filters;
        scope.getTaskStyle = function(a) {
          var color = Amonalies.getAppColor(a.app);
          return {'background': 'linear-gradient(to right, '+color+' 0%, '+color+' 20%, #ddd 21%, #ddd 100%)'};
        };
      }
    }
  }]);
