/**
 * Created by Leo on 03/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('amonalieContainer', ['$window','$timeout','cache','Amonalies','Logger',function($window,$timeout,cache,Amonalies,Logger) {
    return {
      restrict: 'E',
      scope: {group: '=ngModel', amonalies:'=', showtitle:'='},
      templateUrl: 'components/amonalie-container/amonalie-container.html',
      link: function (scope, elm, atr) {
        var _step = 20;
        scope.counter = _step;
        scope.startDrag = function(event, ui, a) {
          Amonalies.dragging = { a: a };
        };
        scope.filters = cache.context.o.filters;

        var nextStep = function(notraise) {
          if (scope.filtered.length>scope.counter) {
            if (scope.filtered.length>scope.counter+_step)
              scope.counter+=_step;
            else
              scope.counter = scope.filtered.length;
          }
          if (!notraise) scope.$apply();
        }
        scope.next = function() { nextStep(true); };

        var W = angular.element($window);
        W.bind("scroll", function(e) {
          e.preventDefault();
          e.stopPropagation();
          var H = W.height();
          var sH = document.body.scrollHeight;
          var sT = W.scrollTop();
          if (sT >= sH - H)
            _.throttle(nextStep,200)();
        });
        scope.getCounter = function(){
          if (scope.filtered)
            return Math.min(scope.counter, scope.filtered.length);
          return scope.counter;
        };
      }
    }
  }]);
