/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('gantt', ['$compile','$rootScope','$location','$timeout','$window','drawing','Gantt','Logger', function ($compile,$rootScope, $location, $timeout, $window, drawing, Gantt, Logger) {

    function drawHeader(ctx, info) {
      drawing.fillRect(ctx, {x:0,y:0}, {w:info.w, h:Gantt.constants.header_height}, Gantt.constants.header_color);
      drawing.drawLine(ctx, {x:0,y:Gantt.constants.header_height}, {x:info.w,y:Gantt.constants.header_height}, Gantt.constants.header_line_color, 1);
      for(var i=0; i<info.days; i++) {
        var x = i*info.step;
        drawing.drawLine(ctx, {x:x, y:0}, {x:x, y:info.h}, '#666');
        drawing.drawText(ctx, (i+1), {x:x+7, y:12}, '10pt Calibri', '#bbb');
      }
    }

    function drawGrid(ctx, info){
      for(var i=0; i<info.h; i+=2*Gantt.constants.row_height) {
        drawing.fillRect(ctx, {x:0,y:i+Gantt.constants.header_height+1}, {w:info.w,h:Gantt.constants.row_height}, '#fff' );
      }
    }

    function drawTask(ctx, info, t) {
      //var left = ~~(scope.task_width*(t.d-1)+scope.offset.x)+1;
      //var top = ~~(Gantt.constants.row_height*t.user_idx+scope.offset.y)+1;
      //var width = ~~(scope.task_width*t.dw)-1;
      var x = ~~(info.step*(t.d-1)+info.offset.x)+1;
      var y = ~~(Gantt.constants.row_height*t.user_idx+info.offset.y)+1;
      var w = ~~(info.step*t.dw)-1;
      var h = Gantt.constants.row_height;
      var c = drawing.colors(t.style);
      t.canvas_area ={ x:x, y:y, w:w, h:h };
      drawing.fillRect(ctx,{x:x,y:y},{w:w,h:h}, c.background );
      drawing.drawLineRect(ctx,{x:x,y:y},{w:w,h:h}, c.line)
      drawing.drawText(ctx, t.a.code, {x:x+4,y:y+15}, 'Calibri 8px', c.text);

    }

    var redraw = function(ctx, info, tasks) {
      drawGrid(ctx, info);
      drawHeader(ctx, info);
      if (tasks.length)
        tasks.forEach(function(t){
          drawTask(ctx, info, t);
        });
    };

    return {
      restrict: 'E',
      scope: { context:'=ngModel' },
      templateUrl: 'components/gantt/gantt.html',
      link: function (scope, elm) {
        var cnv = document.getElementById('gantt-canvas');
        var ctx = cnv.getContext('2d');

        scope.offset= {x:0,y:Gantt.constants.header_height};
        scope.task_width = Gantt.constants.item_min_width;
        scope.ts = [];

        var win = angular.element($window);
        win.bind('resize',function(){
          resizeRedraw();
        });

        var resizeRedraw = function() {
          if (!scope.context) return;
          var date_month = $rootScope.gantt_date.getMonth();
          var date_year = $rootScope.gantt_date.getYear();
          var eff_H = scope.context.height-2;
          var days = drawing.getDaysInMonth(date_month+1, date_year);
          var min_W = Gantt.constants.item_min_width * days;
          var w = elm.width();
          var eff_W = Math.max(w, min_W);

          scope.task_width = eff_W / days;
          var info = {
            w:eff_W,
            h:eff_H,
            m:date_month,
            y:date_year,
            days:days,
            step:scope.task_width,
            offset:scope.offset
          };
          $timeout(function() {
            $('.gantt-scrollable-container').height(eff_H);
          });
          $timeout(function() {
            elm.height(eff_H);
            cnv.width = eff_W;
            cnv.height = eff_H;
            cnv.style.width = eff_W+"px";
            cnv.style.height = eff_H+"px";
          }).then(function() {
            redraw(ctx, info, scope.context.tasks);
          });
        };

        var getTaskAt = function(x,y) {
          var result = $.grep(scope.context.tasks, function(t) {
            return (t.canvas_area && x >= t.canvas_area.x && x < (t.canvas_area.x + t.canvas_area.w) &&
            y >= t.canvas_area.y && y < (t.canvas_area.y + t.canvas_area.h));
            //alert('x='+x+';  y='+y+';   area: '+JSON.stringify(t.canvas_area))
          });
          return result.length ? result[0] : undefined;
        };

        elm.on('mousemove', function(e) {
          e.preventDefault();
          var cr = 'default';
          if(getTaskAt(e.offsetX, e.offsetY))
            cr = 'pointer';
          elm.css({ cursor: cr });
        });

        elm.on('click', function(e) {
          e.preventDefault();
          var task = getTaskAt(e.offsetX, e.offsetY);
          if (task)
            Gantt.showTaskDetail(task);
        });

        scope.$on("GANTT_REFRESH", function () {
          resizeRedraw();
        });

        scope.openTask = function(t) { Gantt.showTaskDetail(t); };

        scope.getTaskStyle = function(t) {
          var left = ~~(scope.task_width*(t.d-1)+scope.offset.x)+1;
          var top = ~~(Gantt.constants.row_height*t.user_idx+scope.offset.y)+1;
          var width = ~~(scope.task_width*t.dw)-1;
          return {left:left+'px', top:top+'px', width:width+'px'};
        };

        resizeRedraw();
      }
    }
  }]);
