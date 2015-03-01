/**
 * Created by Leo on 03/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('amonalieContainer', ['cache','Amonalies',function(cache,Amonalies) {
    return {
      restrict: 'E',
      scope: {group: '=ngModel', amonalies:'=', showtitle:'='},
      templateUrl: 'components/amonalie-container/amonalie-container.html',
      link: function (scope, elm, atr) {
        scope.startDrag = function(event, ui, a) {
          Amonalies.dragging = { a: a };
        };
        scope.filters = cache.context.o.filters;
      }
    }
  }]);
