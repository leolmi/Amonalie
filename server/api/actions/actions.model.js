/**
 * Created by Leo on 23/02/2015.
 */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ActionSchema = new Schema({
  owner:String,
  date:Number,
  context:String,
  action:String,
  obj:String
});

module.exports = mongoose.model('Action', ActionSchema);
