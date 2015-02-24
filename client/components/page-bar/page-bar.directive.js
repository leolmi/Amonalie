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
                  c[b.class]=true;
                  if (b.checked)
                    c['page-bar-button-checked']=true;
                  else
                    c['page-bar-button']=true;
                  return c;
                  //return b.checked ?
                  //  {'page-bar-button-checked':true,b.class:true}:
                  //  {'page-bar-button':true,'"+b.class+"':true};
                };
            }
        }
    }]);
