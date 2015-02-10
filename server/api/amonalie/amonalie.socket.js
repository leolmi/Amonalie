/**
 * Created by Leo on 10/02/2015.
 */
'use strict';

var amonalie = require('./amonalie.model');

exports.register = function(socket) {
  amonalie.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  amonalie.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('amonalie:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('amonalie:remove', doc);
}
