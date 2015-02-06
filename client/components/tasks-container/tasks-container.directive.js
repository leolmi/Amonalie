/**
 * Created by Leo on 03/02/2015.
 */
'use strict';

angular.module('amonalieApp')
    .directive('tasksContainer', ['$location', function ($location) {
        return {
            restrict: 'E',
            scope: {tasks: '=ngModel', amonalies:'='},
            templateUrl: 'components/tasks-container/tasks-container.html',
            link: function (scope, elm, atr) {
                //directive code
            }
        }
    }]);
