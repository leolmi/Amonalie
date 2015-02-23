/**
 * Created by Leo on 23/02/2015.
 */
'use strict';

var action = require('./actions.model');

exports.register = function(socket) {
  action.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('action:save', doc);
}
