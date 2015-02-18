/**
 * Created by Leo on 01/02/2015.
 */
'use strict';
//var mongoose = require('mongoose'),
//  Schema = mongoose.Schema;

/*
 200 OK
 Standard response for successful HTTP requests. The actual response will depend on the request method used. In a GET request, the response will contain an entity corresponding to the requested resource. In a POST request the response will contain an entity describing or containing the result of the action.
 201 Created
 The request has been fulfilled and resulted in a new resource being created.
 202 Accepted
 The request has been accepted for processing, but the processing has not been completed. The request might or might not eventually be acted upon, as it might be disallowed when processing actually takes place.
 203 Non-Authoritative Information (since HTTP/1.1)
 The server successfully processed the request, but is returning information that may be from another source.
 204 No Content
 The server successfully processed the request, but is not returning any content. Usually used as a response to a successful delete request.
 205 Reset Content
 The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.
 206 Partial Content
 The server is delivering only part of the resource (byte serving) due to a range header sent by the client. The range header is used by tools like wget to enable resuming of interrupted downloads, or split a download into multiple simultaneous streams.
 207 Multi-Status (WebDAV; RFC 4918)
 The message body that follows is an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.[4]
 208 Already Reported (WebDAV; RFC 5842)
 The members of a DAV binding have already been enumerated in a previous reply to this request, and are not being included again.
 226 IM Used (RFC 3229)
 */

var _ = require('lodash');

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
    var updated = _.merge(obj, req.body, function(a,b){
      return _.isArray(a) ? b : undefined;
    });
    updated.save(function (err) {
      if (err) { return error(res, err); }
      return ok(res, obj);
    });
  });
  //};
};

exports.create = function(schema, req, res) {
  schema.create(req.body, function(err, obj) {
    if(err) { return error(res, err); }
    return created(res, obj);
  });
};

exports.destroy = function(schema, req, res) {
  schema.findById(req.params.id, function (err, obj) {
    if(err) { return error(res, err); }
    if(!obj) { return notfound(res); }
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
}

exports.uuid = function(template) {
  template = template || 'xxxxxxxxxxxx';
  var d = new Date().getTime();
  var id = template.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return id;
}
