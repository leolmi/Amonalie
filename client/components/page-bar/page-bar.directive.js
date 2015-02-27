/**
 * Created by Leo on 24/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('pageBar', [function () {
    return {
      restrict: 'E',
      scope: { buttons: '=ngModel' },
      templateUrl: 'components/page-bar/page-bar.html',
      link: function (scope, elm, atr) {
        scope.getClass = function(b) {
          var c = {};
          if (!b.divider) {
            if (b.class)
              c[b.class]=true;
            c['aslink'] = true;
            if (b.checked)
              c['page-bar-button-checked'] = true;
            else
              c['page-bar-button'] = true;
          }
          else c['page-bar-divider'] = true;
          return c;
        };
        scope.click = function(b){
          if (typeof b.click=='function')
            b.click();
        };
      }
    }
  }]);
