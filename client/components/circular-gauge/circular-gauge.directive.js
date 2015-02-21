/**
 * Created by Leo on 11/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('circularGauge', ['drawing', function (drawing) {
    var redraw = function(ctx, info) {
      var c = { x:info.w/2-5, y:info.h/2-5 };
      var r = Math.min(info.w/2-20, info.h/2-20);
      drawing.drawCircle(ctx, c, r+info.i_size/1, info.i_color.line, 1, info.i_color.line);
      drawing.drawCircle(ctx, c, r, info.i_color.background,1,info.i_color.line);
      var value = info.value || 43;
      var vA = ((value/100.0)*2.0)-0.5;
      var a = {start:-0.5*Math.PI, end:vA*Math.PI};

      drawing.drawArc(ctx,c,r+(info.i_size/2),a,info.color, info.i_size);
      //drawing.drawText(ctx, ''+value, {x:info.w/2,y:info.h/2},~~(info.w/4)+'pt Calibri', '#333');
    };

    return {
      restrict: 'E',
      template: '<canvas></canvas><div class="gauge-value"><strong>{{info.value}}</strong><small>%</small></div>',
      link: function (scope, elm, atr) {
        var cnv = elm.find('canvas')[0];
        var ctx2d = cnv.getContext('2d');

        scope.$on("TARGET_REFRESH", function (e, info) {
          scope.info = info;
          elm.height = info.h;
          elm.width = info.w;
          cnv.width = info.w;
          cnv.height = info.h;
          cnv.style.width = info.w+"px";
          cnv.style.height = info.h+"px";

          redraw(ctx2d, info);
        });

        //if (!scope.info)
        //  scope.info ={
        //    h:100,
        //    w:100,
        //    color:'#d2322d',
        //    value:0,
        //    i_color:'#222',
        //    i_size:'15'
        //  };
        //
        //
      }
    }
  }]);
