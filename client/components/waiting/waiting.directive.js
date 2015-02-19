/**
 * Created by Leo on 19/02/2015.
 */
'use strict';

angular.module('amonalieApp')
    .directive('waiting', ['$location', function ($location) {
        return {
            restrict: 'E',
            templateUrl: 'components/waiting/waiting.html'
        }
    }]);
