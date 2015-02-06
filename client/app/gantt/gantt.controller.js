/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .controller('GanttCtrl', ['$scope', '$http', '$timeout', 'drawing', 'Gantt', 'Amonalies', function ($scope, $http, $timeout, drawing, Gantt, Amonalies) {

    $scope.context = {
      date:new Date(),
      tasks:[],
      users:[],
      height: 200
    };

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

    var calcTasks = function(amonalies) {
      //$scope.context.tasks = [
      //  {a:{code:'263514', app:'DataPainter'}, d:2, dw:1, style:'success', user:'leo', user_idx:1},
      //  {a:{code:'268741', app:'DataProvider'}, d:6, dw:1, style:'warning', user:'carlo', user_idx:0},
      //  {a:{code:'236589', app:'QueryBuilder'}, d:8, dw:4, style:'danger', user:'yuri', user_idx:2},
      //  {a:{code:'211114', app:'WikiReports'}, d:3, dw:2, style:'primary', user:'leo', user_idx:1}
      //];
      //$scope.context.users = ['carlo','leo','yuri'];
      //return;

      var ts = [];
      var us = [];
      var start_d = new Date($scope.context.date.getFullYear()+'-'+($scope.context.date.getMonth()+1)+'-1');
      var start = start_d.getTime();
      start_d.setMonth(start_d.getMonth()+1);
      var end = start_d.getTime();

      amonalies.forEach(function(a) {
        if (a.tasks.length) {
          a.tasks.forEach(function(t) {
            // 1. la data di inizio è compresa tra 'start' ed 'end';
            // 2. la data di fine è compresa tra 'start' ed 'end';
            // 3 la data d'inizio è anteriore a 'start' e la fine è posteriore a 'end';
            //alert('TASK:'+JSON.stringify(t));
            //alert('start:'+start+'   start_d='+start_d.toLocaleString());
            var d = new Date(t.start);
            //alert('task.start:'+ t.start+'   d='+d.toLocaleString());
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
        $scope.context.users = us;
        $scope.context.tasks = ts;
      });
    };

    var calcHeight = function(){
      var n = $scope.context.users.length ? $scope.context.users.length : 1;
      var H = (n+2) * Gantt.constants.row_height + Gantt.constants.header_height;
      $scope.context.height = H;
      $timeout(function() {
        $('.gantt-container').height(H);
      });
    };

    var refresh = function() {
      $scope.moving = $timeout(function(){
        Amonalies.get(function(amonalies){
          calcTasks(amonalies);
          calcHeight();
        })
      }, 0)
        .then(function () {
          $scope.moving = undefined;
          $timeout(function() {
            $scope.$broadcast("GANTT_REFRESH", $scope.context);
          });
          $scope.loading = false;
        });
    };

    $scope.getMonth = function() {
      return drawing.getMonth($scope.context.date.getMonth());
    };
    $scope.getYear = function() {
      return $scope.context.date.getFullYear();
    };
    $scope.moveDate = function(up) {
      if ($scope.moving)
        $scope.moving.cancel();
      $scope.loading = true;
      var delta = up ? 1 : -1;
      $scope.context.date.setMonth($scope.context.date.getMonth() + delta);
      refresh();
    };

    refresh();

  }]);
