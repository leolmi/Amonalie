/**
 * Created by Leo on 01/02/2015.
 */
'use strict';

var _ = require('lodash');
var L = require('../actions/actions.controller');
var auth = require('../../auth/auth.service');

var log = function(req, ctx, act, obj, org) {
  auth.getUser(req, function(err, user) {
    if (err) return console.log('ERRORE: '+JSON.stringify(err));
    var logobj = getLogObject(obj, org);
    L.log(user.name, ctx, act, logobj)
  });
};

function getLogObject(obj, org) {
  if (!org) return obj;
  var original = (typeof org=='string') ? JSON.parse(org) : org;
  return {original:original, modified:obj};
}


exports.log = log;

/**
 * Return standard 200
 * @param res
 * @param obj
 * @returns {*}
 */
var ok = function(res, obj) {return res.json(200, obj);};
exports.ok = ok;

/**
 * Return standard 201
 * @param res
 * @param obj
 * @returns {*}
 */
var created = function(res, obj) {return res.json(201, obj);};
exports.created = created;

/**
 * Return standard 204
 * @param res
 * @returns {*}
 */
var deleted = function(res) {return res.json(204);};
exports.deleted = deleted;

/**
 * Return standard 404
 * @param res
 * @returns {*}
 */
var notfound = function(res) {return res.send(404); };
exports.notfound = notfound;

/**
 * Return standard 500
 * @param res
 * @param err
 * @returns {*}
 */
var error = function(res, err) { return res.send(500, err); };
exports.error = error;


exports.update = function(schema, req, res) {
  if(req.body._id) { delete req.body._id; }
  console.log('Oggetto: '+JSON.stringify(req.body));
  schema.findById(req.params.id, function (err, obj) {
    if (err) { return error(res, err); }
    if(!obj) { return notfound(res); }

    var original = JSON.stringify(obj);
    var updated = _.merge(obj, req.body, function(a,b){
      return _.isArray(a) ? b : undefined;
    });
    updated.save(function (err) {
      if (err) { return error(res, err); }
      log(req, obj.constructor.modelName, 'upd', updated, original);
      return ok(res, obj);
    });
  });
  //};
};

exports.create = function(schema, req, res) {
  schema.create(req.body, function(err, obj) {
    if(err) { return error(res, err); }
    log(req, obj.constructor.modelName, 'new', obj);
    return created(res, obj);
  });
};

exports.destroy = function(schema, req, res) {
  schema.findById(req.params.id, function (err, obj) {
    if(err) { return error(res, err); }
    if(!obj) { return notfound(res); }
    log(req, obj.constructor.modelName, 'del', obj);
    obj.remove(function(err) {
      if(err) { return error(res, err); }
      return deleted(res);
    });
  });
};

exports.get = function(schema, req, res) {
  schema.findById(req.params.id, function (err, obj) {
    if(err) { return error(res, err); }
    if(!obj) { return notfound(res); }
    return res.json(obj);
  });
};

exports.index = function(schema, req, res) {
  schema.find(function (err, objs) {
    console.log('Trovati: '+objs.length+' elementi.');
    if(err) { return error(res, err); }
    return ok(res, objs);
  });
};

exports.uiid_templates = {
  guid: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
  id12: 'xxxxxxxxxxxx'
};

exports.uuid = function(template) {
  template = template || 'xxxxxxxxxxxx';
  var d = new Date().getTime();
  var id = template.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return id;
};
