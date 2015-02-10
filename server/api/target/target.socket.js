/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var target = require('./target.model');

exports.register = function(socket) {
  target.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  target.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('target:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('target:remove', doc);
}
