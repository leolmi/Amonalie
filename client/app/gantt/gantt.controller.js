/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('GanttCtrl', ['$scope', '$http', '$timeout', 'drawing', 'Gantt', 'Amonalies', function ($scope, $http, $timeout, drawing, Gantt, Amonalies) {

    $scope.date = new Date();

    Amonalies.get(function(amonalies) {
      $scope.amonalies = amonalies;
    });

    var getTask = function(t,a, d, dw){
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
        user: t.owner,
        user_idx: 0
      }
    };

    var calcTasks = function(amonalies, ctx) {
      var ts = [];
      var us = [];
      var start_d = new Date(ctx.date.getFullYear()+'-'+(ctx.date.getMonth()+1)+'-1');
      var start = start_d.getTime();
      start_d.setMonth(start_d.getMonth()+1);
      var end = start_d.getTime();

      amonalies.forEach(function(a) {
        if (a.tasks.length) {
          a.tasks.forEach(function(t) {
            // 1. la data di inizio è compresa tra 'start' ed 'end';
            // 2. la data di fine è compresa tra 'start' ed 'end';
            // 3 la data d'inizio è anteriore a 'start' e la fine è posteriore a 'end';
            var d = new Date(t.start);
            if ((t.start >= start && t.start < end) || (t.end <= end && t.end > start) ||
              (t.start <= start && t.end >= end)) {
              var d = (t.start >= start && t.start < end) ? t.start : start;
              //var d2 = (t.end<=end && t.end>start) ? t.end : end;
              var dw = 1;
              var newt = getTask(t, a, (new Date(d)).getDate(), dw);
              ts.push(newt);
            }
            if (t.owner && us.indexOf(t.owner)<0)
              us.push(t.owner);
          });
          us.sort();
          if (ts.length) {
            ts.forEach(function(t) {
              t.user_idx = us.indexOf(t.user);
            });
          }
        }
        ctx.users = us;
        ctx.tasks = ts;
      });
    };

    var calcHeight = function(ctx){
      var n = ctx.users.length ? ctx.users.length : 1;
      var H = (n+2) * Gantt.constants.row_height + Gantt.constants.header_height;
      ctx.height = H;
      $timeout(function() {
        $('.gantt-container').height(H);
        $('gantt-scrollable-container').height(H);
      });
    };

    var refresh = function() {
      var ctx = {};
      Amonalies.get(function(amonalies){
        ctx.date = $scope.date;
        calcTasks(amonalies, ctx);
        calcHeight(ctx);
        $scope.moving = undefined;
        $scope.context = ctx;
        $timeout(function() {
          $scope.$broadcast("GANTT_REFRESH");
        });
        $scope.loading = false;
      });
    };

    $scope.getMonth = function() {
      return drawing.getMonth($scope.date.getMonth());
    };
    $scope.getYear = function() {
      return $scope.date.getFullYear();
    };
    $scope.moveDate = function(up) {
      if ($scope.moving)
        $scope.moving.cancel();
      $scope.loading = true;
      var delta = up ? 1 : -1;
      $scope.date.setMonth($scope.date.getMonth() + delta);
      refresh();
    };

    refresh();

  }]);
