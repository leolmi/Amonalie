/**
 * Created by Leo on 03/02/2015.
 */
'use strict';

var _ = require('lodash');
var u = require('../utilities/util');
var Amonalie = require('./amonalie.model');
var cow = require('./milking');

// Get list of amonalie
exports.index = function(req, res) {
  return u.index(Amonalie, req, res, {archived:false});
};

// Updates an existing amonalia in the DB.
exports.update = function(req, res) {
  return u.update(Amonalie, req, res);
};

// gestisce le amonalie.
exports.manage = function(req, res) {
  //TODO: sposta nello storico
  //TODO: elimina
  return u.notfound(res);
};

// scarica le anomalie da assistant
exports.milk = function(req, res) {
  cow.milk(req, res);
};
