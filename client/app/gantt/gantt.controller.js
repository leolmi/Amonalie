/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('GanttCtrl', ['$scope','$rootScope','$http','$timeout','Utilities','drawing','Gantt','cache','Amonalies',function ($scope,$rootScope,$http,$timeout,Utilities,drawing,Gantt,cache,Amonalies) {
    $scope.context = cache.context;
    var now = new Date();
    var nowN = now.getTime();
    var elm = document.getElementById('gcontainer');
    var cnv = document.getElementById('gantt-canvas');
    var ctx2d = cnv.getContext('2d');

    function goToday() {
      cache.context.o.gantt.date = new Date();
      refresh();
    }

    $scope.buttons = [{
      desc:'Torna ad oggi',
      class:'fa-bookmark',
      click: goToday
    }];

    var getTask = function(t, a, d, dw){
      var style = 'primary';
      switch (a.state){
        case('dafare'): style='danger'; break;
        case('fando'): style='warning'; break;
        case('fatto'): style='success'; break;
      }
      if (dw<1) dw=1;
      return {
        a:a,
        d:d,
        dw:dw,
        style:style,
        user_id: t.owner,
        user_idx: 0
      }
    };

    function dayDiff(d1, d2) {
      return ~~((d2-d1)/(1000*60*60*24));
    }

    var calcTasks = function(ctx, cb) {
      cb = cb || angular.noop;
      var ts = [];
      var us = [{_id:0, name:'da assegnare'}];
      var m = cache.context.o.gantt.date.getMonth();
      var start_d = new Date(cache.context.o.gantt.date.getFullYear(),m,1);
      var start = start_d.getTime();

      start_d.setMonth(m+1);
      var end = start_d.getTime();
      var endnow = nowN>end ? end : nowN;
      Amonalies.getUsers(function(users) {
        $scope.context.amonalies.forEach(function(a) {
          if (a.tasks.length) {
            a.tasks.forEach(function(t) {
              var newt = {};
              // 1. la data di inizio è compresa tra 'start' ed 'end';
              // 2. la data di fine è compresa tra 'start' ed 'end';
              // 3 la data d'inizio è anteriore a 'start' e la fine è posteriore a 'end';
              if ((t.start >= start && t.start < end) || (t.end <= end && t.end > start) ||
                (t.start <= start && (t.end >= end || !t.end))) {
                // data mostrata di inizio dell'intervento (relativa alla visualizzazione)
                var d = (t.start >= start && t.start < end) ? t.start : start;
                // durata intervento mostrato (relativa alla visualizzazione)
                var dw = 1;
                if (t.end && t.end>d)
                  dw = dayDiff(d, t.end);
                else if (!t.end && d<nowN) {
                  dw = dayDiff(d, endnow);
                  if (nowN<=end) dw++;
                }
                newt = getTask(t, a, (new Date(d)).getDate(), dw);
                ts.push(newt);
              }
              if (t.owner) {
                var exu = $.grep(users, function(u) { return (u._id== t.owner); });
                if (!exu.length)
                  newt.user_id = 0;
                else if (exu.length && Utilities.indexOfByValue(us,'_id', t.owner)<0)
                  us.push(exu[0]);
              }
            });
            us.sort(function(u1, u2){return u1.name.localeCompare(u2.name)});
            if (ts.length) {
              ts.forEach(function(t) {
                t.user_idx = Utilities.indexOfByValue(us,'_id', t.user_id);
              });
            }
          }
        });
        ctx.users = us;
        ctx.tasks = ts;
        cb();
      });
    };

    var calcHeight = function(ctx){
      if (!ctx.users) return;
      var n = ctx.users.length ? ctx.users.length : 1;
      var H = (n+2) * Gantt.constants.row_height + Gantt.constants.header_height;
      ctx.height = H;
      $timeout(function() {
        $('.gantt-container').height(H);
        $('.gantt-scrollable-container').height(H);
      });
    };

    var refresh = function() {
      var ctx = {};
      calcTasks(ctx, function() {
        calcHeight(ctx);
        $scope.moving = undefined;
        $scope.ctx = ctx;
        resizeRedraw();
        $scope.loading = false;
      });
    };

    var resizeRedraw = function() {
      if (!$scope.ctx) return;
      var date_month = cache.context.o.gantt.date.getMonth();
      var date_year = cache.context.o.gantt.date.getYear();
      var eff_H = $scope.ctx.height;
      var days = drawing.getDaysInMonth(date_month+1, date_year);
      var min_W = Gantt.constants.item_min_width * days;
      var w = elm.offsetWidth;
      var eff_W = Math.max(w, min_W);
      var offset= {x:0,y:Gantt.constants.header_height};

      $scope.info = {
        w:eff_W,
        h:eff_H,
        m:date_month,
        y:date_year,
        days:days,
        step:eff_W / days,
        offset:offset
      };
      if (now.getMonth()==date_month && now.getYear()==date_year) {
        $scope.info.today = now.getDate();
        $scope.today = {
          x:(now.getDate()-1)*$scope.info.step,
          w:$scope.info.step,
          h:$scope.info.h
        };
      }
      else $scope.today = undefined;

      $timeout(function() {
        $('.gantt-scrollable-container').height(eff_H);
      });
      $timeout(function() {
        elm.height = eff_H;
        cnv.width = eff_W;
        cnv.height = eff_H;
        cnv.style.width = eff_W+"px";
        cnv.style.height = eff_H+"px";
      }).then(function() {
        Gantt.redraw(ctx2d, $scope.info);
      });
    };

    $scope.openTask = function(t) { Gantt.showTaskDetail(t); };

    $scope.getTodayStyle = function() {
      if ($scope.today)
        return {left:$scope.today.x+'px', width:$scope.today.w+'px', height:$scope.today.h+'px'};
      return '';
    };

    $scope.getTaskStyle = function(t) {
      var left = ~~($scope.info.step*(t.d-1)+$scope.info.offset.x)+1;
      var top = ~~(Gantt.constants.row_height*t.user_idx+$scope.info.offset.y)+1;
      var width = ~~($scope.info.step*t.dw)-1;
      return {left:left+'px', top:top+'px', width:width+'px'};
    };
    $scope.getMonth = function() {
      return drawing.getMonth(cache.context.o.gantt.date.getMonth());
    };
    $scope.getYear = function() {
      return cache.context.o.gantt.date.getFullYear();
    };
    $scope.moveDate = function(up) {
      if ($scope.moving)
        $scope.moving.cancel();
      $scope.loading = true;
      var delta = up ? 1 : -1;
      cache.context.o.gantt.date.setMonth(cache.context.o.gantt.date.getMonth() + delta);
      refresh();
    };
    cache.check(function() {
      refresh();
    });
  }]);
