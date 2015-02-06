/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('gantt', ['$location','$timeout','$window','drawing','Gantt', function ($location, $timeout, $window, drawing, Gantt) {

    var drawHeader = function(ctx, info) {
      drawing.fillRect(ctx, {x:0,y:0}, {w:info.w, h:Gantt.constants.header_height}, Gantt.constants.header_color);
      drawing.drawLine(ctx, {x:0,y:Gantt.constants.header_height}, {x:info.w,y:Gantt.constants.header_height}, Gantt.constants.header_line_color, 1);
      for(var i=0; i<info.days; i++) {
        var x = i*info.step;
        drawing.drawLine(ctx, {x:x, y:0}, {x:x, y:info.h}, '#666');
        drawing.drawText(ctx, (i+1), {x:x+7, y:12}, '10pt Calibri', '#bbb');
      }
    };

    var drawGrid = function(ctx, info) {
      for(var i=0; i<info.h; i+=2*Gantt.constants.row_height) {
        drawing.fillRect(ctx, {x:0,y:i+Gantt.constants.header_height+1}, {w:info.w,h:Gantt.constants.row_height}, '#fff' );
      }
    };

    return {
      restrict: 'E',
      //scope: { tasks:'=ngModel' },
      templateUrl: 'components/gantt/gantt.html',
      link: function (scope, elm) {
        var now = new Date();
        scope.args = {
          date_month: now.getMonth(),
          date_year: now.getYear()
        };
        var cnv = document.getElementById('gantt-canvas');
        var ctx = cnv.getContext('2d');

        scope.offset= {x:0,y:Gantt.constants.header_height};
        scope.task_width = Gantt.constants.item_min_width;
        scope.data = {w:600, h:200, m:0, y:2000, days:31};
        scope.ts = [];


        scope.$on("GANTT_REFRESH", function (e, context) {
          scope.args.date_month = context.date.getMonth();
          scope.args.date_year = context.date.getYear();
          $timeout(function() {
            elm.height(context.height-2);
            $('.gantt-scrollable-container').height(context.height-2);
          });
          fullRefresh();
          $timeout(function() {
            scope.tasks = context.tasks;
          },100);
        });

        var win = angular.element($window);
        win.bind('resize',function(){
          fullRefresh();
        });

        var resize = function() {
          var days = drawing.getDaysInMonth(scope.args.date_month+1, scope.args.date_year);
          var minw = Gantt.constants.item_min_width * days;
          var w = elm.width();
          var h = elm.height();

          scope.args.w = w ? w : 'non definito';
          scope.args.h = h ? h : 'non definito';
          scope.args.days = days;

          cnv.width = Math.max(w, minw);
          cnv.height = h;
          cnv.style.width = cnv.width+"px";
          cnv.style.height = cnv.height+"px";
          scope.task_width = cnv.width / days;
          scope.data = {
            w:cnv.width,
            h:cnv.height,
            m:scope.args.date_month,
            y:scope.args.date_year,
            days:days,
            step:scope.task_width};
        };

        var redraw = function() {
          drawGrid(ctx, scope.data);
          drawHeader(ctx, scope.data);
        };

        var fullRefresh = function() {
          resize();
          redraw();
        };

        scope.openTask = function(t) { Gantt.showTaskDetail(t); };

        scope.getTaskStyle = function(t) {
          var left = ~~(scope.task_width*(t.d-1)+scope.offset.x)+1;
          var top = ~~(Gantt.constants.row_height*t.user_idx+scope.offset.y)+1;
          var width = ~~(scope.task_width*t.dw)-1;
          return {left:left+'px', top:top+'px', width:width+'px'};
        };


        fullRefresh();
      }
    }
  }]);
