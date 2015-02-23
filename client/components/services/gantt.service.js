/**
 * Created by Leo on 05/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .factory('Gantt', ['Amonalies','drawing', function(Amonalies,drawing) {
    var constants = {
      header_height: 32,
      header_color: '#222',
      header_today_color: 'blue',
      header_line_color: '#111',
      item_min_width: 48,
      row_height: 24
    };

    var showTaskDetail = function(t) {
      var opt = {
        task:t,
        readonly: true
      };
      Amonalies.editAmonalia(t.a, opt);
    };

    function drawHeader(ctx, info) {
      drawing.fillRect(ctx, {x:0,y:0}, {w:info.w, h:constants.header_height}, constants.header_color);
      drawing.drawLine(ctx, {x:0,y:constants.header_height}, {x:info.w,y:constants.header_height}, constants.header_line_color, 1);
      for(var i=0; i<info.days; i++) {
        var x = i*info.step;
        if (info.today==i+1)
          drawing.fillRect(ctx, {x:x,y:0}, {w:info.step, h:constants.header_height}, constants.header_today_color);
        drawing.drawLine(ctx, {x:x, y:0}, {x:x, y:info.h}, '#666');
        drawing.drawText(ctx, (i+1), {x:x+7, y:12}, '10pt Calibri', '#bbb');
      }
    }

    function drawGrid(ctx, info){
      for(var i=0; i<info.h; i+=2*constants.row_height) {
        drawing.fillRect(ctx, {x:0,y:i+constants.header_height+1}, {w:info.w,h:constants.row_height}, '#fff' );
      }
    }

    function drawTask(ctx, info, t) {
      var x = ~~(info.step*(t.d-1)+info.offset.x)+1;
      var y = ~~(constants.row_height*t.user_idx+info.offset.y)+1;
      var w = ~~(info.step*t.dw)-1;
      var h = constants.row_height;
      var c = drawing.colors(t.style);
      t.canvas_area ={ x:x, y:y, w:w, h:h };
      drawing.fillRect(ctx,{x:x,y:y},{w:w,h:h}, c.background );
      drawing.drawLineRect(ctx,{x:x,y:y},{w:w,h:h}, c.line)
      drawing.drawText(ctx, t.a.code, {x:x+4,y:y+15}, 'Calibri 8px', c.text);
    }

    /**
     *
     * @param ctx
     * @param info
     * @param [tasks]
     */
    var redraw = function(ctx, info, tasks) {
      drawGrid(ctx, info);
      drawHeader(ctx, info);
      if (tasks && tasks.length)
        tasks.forEach(function(t){
          drawTask(ctx, info, t);
        });
    };



    return {
      constants:constants,
      showTaskDetail:showTaskDetail,
      redraw:redraw
    }
  }]);
