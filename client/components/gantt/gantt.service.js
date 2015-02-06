/**
 * Created by Leo on 05/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .factory('Gantt', ['Modal', function(Modal) {
    var paintArgs = {
      header_height: 32,
      header_color: '#222',
      header_line_color: '#111',
      item_min_width: 48,
      row_height: 24
    };
    var modalShow = Modal.confirm.show();

    var showTaskDetail = function(t) {
      modalShow(t);
    };
    return {
      constants:paintArgs,
      showTaskDetail:showTaskDetail
    }
  }]);
