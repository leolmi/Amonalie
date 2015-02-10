/**
 * Created by Leo on 10/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('target', ['Modal','Amonalies', function (Modal, Amonalies) {
    return {
      restrict: 'E',
      scope: { target: '=ngModel', amonalies:'='},
      templateUrl: 'components/target/target.html',
      link: function (scope, elm, atr) {
        scope.isCollapsed = true;
        scope.getDate = function() {
          return (new Date(scope.target.date)).toLocaleString();
        };
        scope.toggle = function() {
          scope.isCollapsed = !scope.isCollapsed;
        };
        var value = Math.floor((Math.random() * 100) + 1);
        var type;

        if (value < 25) {
          type = 'danger';
        } else if (value < 50) {
          type = 'warning';
        } else if (value < 85) {
          type = 'info';
        } else {
          type = 'success';
        }

        scope.dynamic = value;
        scope.type = type;

        var modalDelete = Modal.confirm.delete(function(target) {
          Amonalies.deleteTarget(target);
        });

        scope.delete = function() {
          modalDelete(scope.target.name, scope.target);
        };
      }
    }
  }]);
