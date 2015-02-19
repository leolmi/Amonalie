/**
 * Created by Leo on 18/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('band', ['$timeout','drawing',function($timeout,drawing) {
    var redraw = function(ctx, info) {
      var points=[
        {x:info.W-(info.d+info.s),y:0},
        {x:info.W-info.d,y:0},
        {x:info.W,y:info.d},
        {x:info.W,y:info.d+info.s}
      ];
      drawing.drawPolygon(ctx, points, info.color);
    };

    return {
      restrict: 'E',
      scope: { color: '=', size:'=', distance:'='},
      templateUrl: 'components/band/band.html',
      link: function (scope, elm, atr) {
        var cnv = elm.find('canvas')[0]; //document.getElementById('color-band');
        var ctx2d = cnv.getContext('2d');
        $timeout(function() {
          cnv.width = elm.width();
          cnv.height = elm.height();

        }).then(function() {
          var info = {
            W: elm.width(),
            d: scope.distance || 50,
            s: scope.size || 10,
            color: scope.color
          };
          redraw(ctx2d, info);
        });
      }
    }
}]);
