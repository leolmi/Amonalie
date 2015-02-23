/**
 * Created by Leo on 23/02/2015.
 */
'use strict';

var _ = require('lodash');
var u = require('../utilities/util');
var Action = require('./actions.model');

// Get list of actions
exports.index = function(req, res) {
  return u.index(Action, req, res);
};

exports.log = function(own, ctx, act, obj){
  var a = {
    owner:own,
    date:(new Date()).getTime(),
    context:ctx,
    action:act,
    obj:obj ? JSON.stringify(obj) : undefined
  };
  console.log('actions: '+JSON.stringify(a));
  Action.create(a);
};
