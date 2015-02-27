/**
 * Created by Leo on 12/02/2015.
 */
'use strict';

var User = require('../user/user.model');
var _ = require('lodash');
var https = require('https');
var config = require('../../config/environment');
var querystring = require('querystring');
var u = require('../utilities/util');
var fs = require('fs');
var cheerio = require('cheerio');
var Amonalie = require('./amonalie.model');

var content_type_appwww = 'application/x-www-form-urlencoded';
var content_type_multipart = 'multipart/form-data; boundary=';
var multipart_boundary_prefix = '---------------------------';
var multipart_body_header = 'Content-Disposition: form-data; name=';


var noop = function() {};
var download_body = {
  idRecord:'',
  selIdx:'-1',
  startRow:'1',
  src_id:'',
  chkf_1:'on',
  src_istituto:'',
  chkf_2:'on',
  src_gruppo:'',
  src_applicativo:'',
  chkf_3:'on',
  src_funzione:'',
  chkf_4:'on',
  src_versione:'',
  chkf_5:'on',
  src_ambiente:'',
  src_tiposegn_cliente:'',
  src_tiposegn:'',
  chkf_7:'on',
  src_tiposegn_int:'',
  src_priorita_cliente:'',
  src_priorita:'',
  chkf_9:'on',
  src_priorita_int:'',
  chkf_10:'on',
  src_stato:'',
  chkf_11:'on',
  src_sottostato:'',
  src_stato_lab:'',
  src_laboratorio:'',
  src_rifcliente:'',
  chkf_14:'on',
  src_riflab:'',
  src_visibilita:'',
  src_sPresidio:'',
  src_sAttribuzione:'',
  chkf_49:'on',
  src_data_segnalazione_from:'',
  src_data_segnalazione_timeFrom:'',
  src_data_segnalazione_to:'',
  src_data_segnalazione_timeTo:'',
  chkf_17:'on',
  src_data_stato_from:'',
  src_data_stato_to:'',
  src_data_rilascio_from:'',
  src_data_rilascio_to:'',
  src_data_rilint_from:'',
  src_data_rilint_to:'',
  src_data_inlav_from:'',
  src_data_inlav_to:'',
  src_data_attlab_from:'',
  src_data_attlab_to:'',
  chkf_38:'on',
  src_var_tempi:'',
  src_giorni_previsti:'',
  chkf_21:'on',
  src_versione_correttiva:'',
  chkf_22:'on',
  src_Autore:'',
  chkf_23:'on',
  src_ref_Tec:'',
  chkf_27:'on',
  src_soggetto:'',
  chkf_33:'on',
  src_data_note_cli_from:'',
  src_data_note_cli_to:'',
  src_relazione:'',
  src_descrizione:'',
  chkf_29:'on',
  src_note:'',
  chkf_30:'on',
  src_note_int:'',
  chkf_31:'on',
  block_campiFiltro_state:'view',
  block_campiFiltro_mngRec:'',
  filter:'-- Salva filtro --',
  customFilter:'',
  block_filtri_state:'view',
  block_filtri_mngRec:'',
  resetSrc:'',
  searchRcdsrcRcd:'0',
  report:'xls2',
  panel_formPanel:'panel_formPanel3',
  formPanel_evid:'',
  searchRcd:'1',
  arrFields:"<wddxPacket version='1.0'><header/><data><string></string></data></wddxPacket>",
  arrId:"<wddxPacket version='1.0'><header/><data><string></string></data></wddxPacket>",
  chkFields:'',
  attribuzione_id:'',
  nota_id:'',
  writeTo:'message',
  state:'view',
  mngRec:''
};


var getRedirectPath = function(pre, nxt) {
  var pre_split = pre.split('/');
  var nxt_split = nxt.split('/');

  pre_split.pop();
  nxt_split.forEach(function(e){
    if (e=='..')
      pre_split.pop();
    else
      pre_split.push(e);
  });

  return pre_split.join('/');
};

var buildMultipartBody = function(data) {
  var id = u.uuid();
  var boundary = multipart_boundary_prefix+id;
  var result = {
    boundary: boundary,
    body:''
  };
  for(var p in data) {
    result.body += '--'+boundary+'\r\n'+multipart_body_header+'"'+p+'"\r\n\r\n'+data[p].toString()+'\r\n';
  }
  result.body += '--'+boundary+'--'
  return result;
}

/**
 * Richiesta
 * @param desc
 * @param options
 * @param {String} data
 * @param target
 * @param cb
 */
var doHttpsRequest = function(desc, options, data, target, cb) {
  var skipped = false;
  var download = false;
  cb = cb || noop;
  console.log('['+desc+']-OPTIONS: ' + JSON.stringify(options));
  var req = https.request(options, function(res) {
    var result = {
      code:res.statusCode,
      headers:res.headers
    }
    console.log('['+desc+']-RESULTS: ' + JSON.stringify(result));

    var newpath = res.headers.location;
    if (res.statusCode.toString()=='302' && newpath) {
      skipped = true;
      var oldpath = options.path;
      options.path = getRedirectPath(options.path ,newpath);
      doHttpsRequest('redir - '+desc, options, null, null, cb);
    }

    if (target) {
      download = true;
      res.setEncoding('binary');
      res.pipe(target);
      target.on('finish', function() {
        console.log('Finito di scrivere il file!');
        target.close(cb(options,result, null));
      });
    }
    else res.setEncoding('utf8');

    var content = '';


    res.on('data', function (chunk) {
      content+=chunk;
    });
    res.on('end', function () {
      console.log('['+desc+']-Fine richiesta!   skipped='+skipped+'   download='+download+'  target='+(target ? 'si' : 'no'));
      if (!skipped && !target && !download) {
        options.headers = _.merge(options.headers, req.headers);
        cb(options, result, content);
      }
    });

  });

  req.on('error', function(e) {
    console.log('['+desc+']-problem with request: ' + e.message);
  });

  if (data) {
    //console.log('data: '+data);
    req.write(data);
  }

  req.end();
};

var getFileName = function() {
  var now = new Date();
  return 'data_'+now.getTime();
};


/**
 *
 * */
exports.milk = function(exreq, exres) {

  console.log('ENV:'+JSON.stringify(process.env));

  var userId = exreq.params.id;
  var user_options = exreq.body || {};
  User.findById(userId, function (err, user) {
    if (err) return u.error(exres, err);
    if (!user) return u.error(exres, new Error('Utente non trovato!'));
    if (!user.hasValidAssistant) return u.error(exres, new Error('Account assistant non valido!'));

    var options = {
      host: process.env.MILK_HOST,
      method:'GET',
      path: process.env.MILK_PATH_LOGIN,
      keepAlive:true,
      headers:{}
    };

    var cookies = {};
    doHttpsRequest('accesso', options, undefined, undefined, function(o1, r1, c1) {
      if (r1.code!=200)
        return u.error(exres, new Error('[accesso] - terminata con codice: '+r1.code));

      var data = {
        username:user.assistant[0].username,
        password:user.assistant[0].password,
        sub_validate:'Login'
      };
      var str_data = querystring.stringify(data);

      o1.method = 'POST';
      o1.path = process.env.MILK_PATH_LOGIN_VALIDATE;
      o1.headers.referer = process.env.MILK_REFERER_LOGIN;
      o1.headers['content-type'] = content_type_appwww;
      o1.headers['content-length'] = str_data.length;
      o1.headers['authorization'] = 'Basic ' + new Buffer(data.username+':'+data.password).toString('base64');

      cookies = r1.headers['set-cookie'];

      o1.headers.cookie = cookies;

      console.log('Dati di login:'+JSON.stringify(data));

      doHttpsRequest('login', o1, str_data, undefined, function(o2, r2, c2) {
        if (r2.code!=200)
          return u.error(exres, new Error('[login] - terminata con codice: '+r2.code));

        if(o2.headers['content-length']) { delete o2.headers['content-length']; }
        o2.method = 'GET';
        o2.path = process.env.MILK_PATH_LOGIN_INIT1;
        o2.headers.referer = process.env.MILK_REFERER_VALIDATE;
        o2.headers['accept-encoding'] = 'gzip, deflate';
        o2.headers['DNT'] = '1';
        o2.headers['accept'] = 'text/html, application/xhtml+xml, */*';

        console.log('procede all\'apertura...');
        doHttpsRequest('apertura', o2, undefined, undefined, function(o3, r3, c3) {
          if (r3.code!=200)
            return u.error(exres, new Error('[apertura] - terminata con codice: '+r3.code));

          //QUI PUO' PARSARE I DATI PER GLI ELENCHI...

          data = buildMultipartBody(download_body);
          var str_data1 = data.body;
          o3.path = process.env.MILK_PATH_DOWNLOAD;
          o3.method = 'POST';
          o3.headers.referer = process.env.MILK_REFERER_DOWNLOAD;
          o3.headers['content-type'] = content_type_multipart+data.boundary;
          o3.headers['content-length'] = str_data1.length;
          var filename = getFileName()+'.dat';
          var fullfilename = config.root + '/server/data/'+filename;
          var target = fs.createWriteStream(fullfilename);
          doHttpsRequest('download', o3, str_data1, target, function(o4, r4, c4) {
            if (r4.code!=200)
              return u.error(exres, new Error('[download] - terminata con codice: '+r4.code));

            loadData(fullfilename, user_options, function(err, results) {
              fs.unlink(fullfilename);
              if (err)
                return u.error(exres, err);
              return u.ok(exres, results);
            });
          });
        });
      });
    });
  });
};

var getJsonTables = function(html) {
  var tables = [];
  var $ = cheerio.load(html);

  $('table').each(function(i, table) {
    var tableAsJson = [];
    // Get column headings
    // @fixme Doesn't support vertical column headings.
    // @todo Try to support badly formated tables.
    var columnHeadings = [];
    $(table).children('tr').each(function(i, row) {
      $(row).children('th').each(function(j, cell) {
        columnHeadings[j] = $(cell).text().trim();
      });
    });

    // Fetch each row
    $(table).children('tr').each(function(i, row) {
      var rowAsJson = {};
      $(row).children('td').each(function(j, cell) {
        if (columnHeadings[j]) {
          rowAsJson[ columnHeadings[j] ] = $(cell).text().trim();
        } else {
          rowAsJson[j] = $(cell).text().trim();
        }
      });

      // Skip blank rows
      if (JSON.stringify(rowAsJson) != '{}')
        tableAsJson.push(rowAsJson);
    });

    // Add the table to the response
    if (tableAsJson.length != 0)
      tables.push(tableAsJson);
  });
  return tables;
};


var loadData = function(filename, options, cb) {
  cb = cb || noop;

  fs.readFile(filename, function (err, html) {
    if (err) return cb(err);
    // trasforma le tabelle in JSON
    var tables = getJsonTables(html);
    // l'ultima tabella è quella dei dati
    var table = tables.length ? tables[tables.length-1] : undefined;
    if (!table || !table.length)
      return cb(new Error('Impossibile rilevare la tabella dati!'));

    var columns = table[0];
    table.shift();
    var result = {
      updated:[],
      added:[],
      discards:[]
    };

    var handled = 0;
    table.forEach(function(r){
      var a = Amonalie.generate(r, columns);
      handleAmonalia(a, result, function() {
        handled++;
        if (handled==table.length)
          cb(undefined, result);
      });
    });
  });
};

var handleAmonalia = function(a, result, cb) {
  cb = cb || noop;
  Amonalie.findOne({code: a.code}, function (err, exa) {
    // se genera errore aggiunge lo scarto
    if (err) {
      result.discards.push(JSON.stringify(a));
      cb();
    }
    // se esiste l'aggiorna
    else if (exa && exa.code) {
      var updated = _.merge(exa, a, function (e1, e2) {
        return _.isArray(e1) ? e2 : undefined;
      });
      updated.save(function (err) {
        if (err)
          result.discards.push(JSON.stringify(a));
        else
          result.updated.push(a);
        cb();
      });
    }
    // se non esiste la aggiunge all'elenco
    else {
      var newa = new Amonalie(a);
      newa.save(function (err) {
        if (err)
          result.discards.push(JSON.stringify(a));
        else
          result.added.push(a);
        cb();
      });
    }
  });
};

