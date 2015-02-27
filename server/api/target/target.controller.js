/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /target              ->  index
 * POST    /target              ->  create
 * GET     /target/:id          ->  show
 * PUT     /target/:id          ->  update
 * DELETE  /target/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Target = require('./target.model');
var u = require('../utilities/util');

// Get list of targets
exports.index = function(req, res) {
  return u.index(Target, req, res, {archived:false});
};

// Get a single target
exports.show = function(req, res) {
  return u.get(Target, req, res);
};

// Creates a new target in the DB.
exports.create = function(req, res) {
  return u.create(Target, req, res);
};

// Updates an existing target in the DB.
exports.update = function(req, res) {
  return u.update(Target, req, res);
};

// Deletes a target from the DB.
exports.destroy = function(req, res) {
  return u.destroy(Target, req, res);
};
