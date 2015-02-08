/**
 * Created by Leo on 03/02/2015.
 */
'use strict';

var _ = require('lodash');
var u = require('../utilities/util');
var Amonalie = require('./amonalie.model');


// Get list of amonalie
exports.index = function(req, res) {
  return u.index(Amonalie, req, res);
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


var https = require('https');

// scarica le anomalie da assistant
exports.milk = function(req, res) {

  /**
  * vedi:
  *  http://nodejs.org/api/https.html#https_https_request_options_callback
  *
  */

  var o = req.body;


  //https://www.onlineassistant-webtool.com/login/index.cfm

  var options = {
    hostname: 'www.onlineassistant-webtool.com',
    port: 443,
    path: '/login/index.cfm',
    method: 'GET'
  };

  var req = https.request(options, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);



  });

  req.end();

  req.on('error', function(e) {
    console.error(e);
  });





  //var options = {
  //  host: 'www.onlineassistant-webtool.com',
  //  path: '/',
  //  port: '1338',
  //  //This is the only line that is new. `headers` is an object with the headers to request
  //  headers: {'custom': 'Custom Header Demo works'}
  //};
  //
  //callback = function(response) {
  //  var str = ''
  //  response.on('data', function (chunk) {
  //    str += chunk;
  //  });
  //
  //  response.on('end', function () {
  //    console.log(str);
  //  });
  //}
  //
  //var req = http.request(options, callback);
  //req.end();



};
