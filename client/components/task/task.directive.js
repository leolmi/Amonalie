/**
 * Created by Leo on 03/02/2015.
 */
'use strict';

angular.module('amonalieApp')
    .directive('task', ['$location', function ($location) {
        return {
            restrict: 'E',
            scope: {amonalia: '=ngModel'},
            templateUrl: 'components/task/task.html',
            link: function (scope, elm, atr) {
              scope.opened = false;
              scope.toggle = function() {
                scope.opened=!scope.opened;
              };

              scope.isworking = function(a){
                return (a.state=='fando');
              };
              scope.getusers = function(a){
                var users = [];
                if (a.tasks.length) {
                  a.tasks.forEach(function(t){
                    if (users.indexOf(t.owner)<0)
                      users.push(t.owner);
                  });
                }
                return (users.length) ? users.join() : '?';
              };
            }
        }
    }]);
