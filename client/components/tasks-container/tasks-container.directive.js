/**
 * Created by Leo on 03/02/2015.
 */
'use strict';

angular.module('amonalieApp')
    .directive('tasksContainer', [function () {
        return {
            restrict: 'E',
            scope: {tasks: '=ngModel', amonalies:'=', showtitle:'='},
            templateUrl: 'components/tasks-container/tasks-container.html',
            link: function (scope, elm, atr) {
            }
        }
    }]);
