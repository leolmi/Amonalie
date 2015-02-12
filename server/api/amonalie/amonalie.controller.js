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
var config = require('../../config/environment');

// scarica le anomalie da assistant
exports.milk = function(req, res) {
  var base_url = 'www.onlineassistant-webtool.com';
  var username = 'olmi';
  var password = 'olmi';

  https.get()

};


var test = function(req, res) {
  /**
  * vedi:
  *  http://nodejs.org/api/https.html#https_https_request_options_callback
  *
  */

  var o = req.body;


  var options = {
    hostname: base_url,
    port: 443,
    path: '/login/index.cfm?fuseaction=home.validate',
    headers: {
      Authorization: 'Basic ' + new Buffer(username + ':' + password).toString('base64')
    },
    method: 'POST'
  };
  options.agent = new https.Agent({keepAlive: true});

  console.log('opzioni: '+JSON.stringify(options));

  //1.3 - accede al sito
  var req1 = https.request(options, function(res1) {
    console.log("[1.3] statusCode: ", res1.statusCode);
    console.log("[1.3] headers: ", res1.headers);


    var body = '';
    console.log("[1.3] req2-options: ", options);
    res1.on('data', function(data) {
      body += data;
    });


    res1.on('end', function() {
      console.log(body);
      //options.headers = _.merge(options.headers, res1.headers);
      nextReq(options, body);
    });




  });

  req1.end();
  req1.on('error', function(e) {
    console.error('REQ1 ERROR: ' + JSON.stringify(e));
  });

  function nextReq(options, body) {
    options.method = 'GET'
    options.path = '/login/index.cfm?fuseaction=home.initService&s=8177';
    console.log("[2.3] req2-options: ", options);

    //2.3 - inizializza
    var req2 = https.request(options, function(res2) {
      console.log("[2.3] statusCode: ", res2.statusCode);
      console.log("[2.3] headers: ", res2.headers);
      var body2 = '';
      //3.3 - scarica il file html
      res2.on('data', function(data) {
        body2 += data;
      });


      res2.on('end', function() {
        console.log('BODY2: '+body2);

      });


    });
    req2.end();
    req2.on('error', function(e) {
      console.error('REQ2 ERROR: ' + JSON.stringify(e));
    });
  }



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
