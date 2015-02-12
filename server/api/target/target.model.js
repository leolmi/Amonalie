'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TargetSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  date: Number
});

module.exports = mongoose.model('Target', TargetSchema);