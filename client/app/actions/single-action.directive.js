/**
 * Created by Leo on 23/02/2015.
 */
'use strict';

angular.module('amonalieApp')
    .directive('singleAction', ['$location', function ($location) {
        return {
            restrict: 'E',
            scope: {a: '=ngModel'},
            templateUrl: 'app/actions/single-action.html',
            link: function (scope, elm, atr) {
              scope.collapsed = true;
              scope.getActionDesc = function(act) {
                switch(act){
                  case 'new': return 'creazione';
                  case 'del': return 'eliminazione';
                  case 'upd': return 'modifica';
                  default: return act;
                }
              };
              scope.getDate = function(n) {
                return (new Date(n)).toLocaleString();
              };
            }
        }
    }]);
