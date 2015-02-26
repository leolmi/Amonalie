/**
 * Created by Leo on 03/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('task', ['cache','Modal','Amonalies','Logger', function (cache,Modal,Amonalies,Logger) {
    return {
      restrict: 'E',
      scope: {amonalia: '=ngModel'},
      templateUrl: 'components/task/task.html',
      link: function (scope, elm, atr) {
        scope.opened = false;

        var modalDelete = Modal.confirm.delete(function(a) {
          Amonalies.deleteAmonalia(a, function(){
            Logger.ok('Anomalia '+ a.code+' eliminata!');
          });
        });

        scope.toggle = function() {
          scope.opened=!scope.opened;
        };

        scope.isworking = function(){
          return (scope.amonalia.state=='fando');
        };
        scope.getusers = function(){
          var users = [];
          if (scope.amonalia.tasks.length) {
            scope.amonalia.tasks.forEach(function(t){
              if (users.indexOf(t.owner)<0)
                users.push(t.owner);
            });
          }
          return (users.length) ? users.join() : '?';
        };

        scope.delete = function() {
          modalDelete(scope.amonalia.code, scope.amonalia);
        };

        scope.details = function() {
          Amonalies.editAmonalia(scope.amonalia);
        };

        scope.select = function() {
          scope.amonalia.selected = scope.amonalia.selected ? false : true;
        };
      }
    }
  }]);
