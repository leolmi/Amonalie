/**
 * Created by Leo on 03/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .directive('amonalia', ['cache','Modal','Amonalies','Logger', function (cache,Modal,Amonalies,Logger) {
    return {
      restrict: 'E',
      scope: {amonalia: '=ngModel'},
      templateUrl: 'components/amonalia/amonalia.html',
      link: function (scope, elm, atr) {
        scope.opened = false;
        Amonalies.getUsers(function(users){
          var names = [];
          if (scope.amonalia.tasks.length) {
            scope.amonalia.tasks.forEach(function(t){
              var n = Amonalies.getUserName(users, t.owner);
              if (n && names.indexOf(n)<0)
                names.push(n);
            });
          }
          scope.usersnames = (names.length) ? names.join() : '?';
        });
        scope.toggle = function() {
          scope.opened=!scope.opened;
        };

        var appcolor = Amonalies.getAppColor(scope.amonalia.app);
        scope.appstyle = {color:appcolor};

        scope.isworking = function(){
          return (scope.amonalia.state=='fando');
        };

        scope.details = function() {
          Amonalies.editAmonalia(scope.amonalia);
        };

        scope.isSelected = function() { return (cache.context.o.selection.indexOf(scope.amonalia)>=0); };

        scope.select = function() {
          cache.select(scope.amonalia);
        };
      }
    }
  }]);
