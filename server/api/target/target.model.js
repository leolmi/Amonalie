'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TargetSchema = new Schema({
  name: String,
  info: String,
  author:String,
  active: Boolean,
  date: Number,
  archived:Boolean
});

module.exports = mongoose.model('Target', TargetSchema);
