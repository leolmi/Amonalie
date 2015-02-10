/**
 * Created by Leo on 03/02/2015.
 */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TaskSchema = new Schema({
  owner:String,
  start:Number,
  end:Number,
  work:String,
  notes:String,
  target:String
});

var ParamSchema = new Schema({
  name: String,
  value: String
})

var AmonalieSchema = new Schema({
  code:String,
  app:String,
  desc:String,
  state:String,
  tasks: [TaskSchema],
  params: [ParamSchema]
});

module.exports = mongoose.model('Amonalie', AmonalieSchema);
