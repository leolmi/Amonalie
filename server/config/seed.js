/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Target = require('../api/target/target.model');
var Amonalie = require('../api/amonalie/amonalie.model');
var User = require('../api/user/user.model');

Target.find({}).remove(function() {
  //var d = new Date('2015-2-16');
  //Target.create({
  //  _id: '54b3e04cde6279a8211b42fd',
  //  name: 'Obiettivo di test',
  //  info: 'Test per vedere se funziona',
  //  active: true,
  //  date: d.getTime()
  //},function() {
  //  console.log('finished populating things');
  //});
});



Amonalie.find({}).remove(function() {
  var d1 = new Date('2015-2-4');
  var d1_n = d1.getTime();
  var d2 = new Date('2015-2-6');
  var d2_n = d2.getTime();
  console.log('d1:'+d1_n+'  d1:'+d1.toLocaleString());
  console.log('d2:'+d2_n+'  d2:'+d2.toLocaleString());

  Amonalie.create({
    code:'263514',
    app:'DataPainter',
    obj:'descrizione breve dell\'anomalia bla',
    desc:'aswqe ew rqwcrq cr qrc q fqfc qfqef qw fr wr qerqwer qwercqewrqerc qwercqcr qwerqcr qwcrqrewr qer qdfaf sdf asdfasdfasdfs',
    state: 'fando',
    tasks: [
      {owner:'leo', start:d2_n, end:0, work:'', target:'54b3e04cde6279a8211b42fd'}],
    params: [
      {name:'priority',value:'3'},
      {name:'stima',value:'6'},
      {name:'ref. tech',value:'zanella'}]
  },{
    code:'263115',
    app:'WikiReports',
    obj:'descrizione breve dell\'anomalia bla',
    desc:'asdfaf sdf asdfasdfasdfs asdf dsf asdfasdf asdf asfas dfas dfasdf asdfasd sdf asdfas dfasdf asdf asfas asdfasd fasd f',
    state: 'dafare',
    tasks: [
      {owner:'yuri', start:d1_n, end:d2_n, work:'WR_004'},
      {owner:'yuri', start:d2_n, end:d2_n, work:'WR_005'}],
    params: [
      {name:'priority',value:'3'},
      {name:'stima',value:'6'},
      {name:'ref. tech',value:'zanella'}]
  },{
    code:'262555',
    app:'QueryBuilder',
    obj:'descrizione breve dell\'anomalia bla',
    desc:'asdfaf sdf asdfa b kytbhrt bhr tbh rt bhrtb rythrbh rtbh kyt bryth rytbhrty brt hb ryhbrbt h rtyhrytbh rythrt bhrybhrt hrtbhr thryh rthrthr th rtyhr tbh rtyh rthsdfasdfs',
    state: undefined,
    tasks: [],
    params: [
      {name:'priority',value:'3'},
      {name:'stima',value:'6'},
      {name:'ref. tech',value:'zanella'}]
  },function() {
    console.log('finished populating amonalie');
  });
});

User.find({}).remove(function() {
  User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
    },{
      provider: 'local',
      role: 'admin',
      name: 'leo',
      email: 'leo.olmi@gmail.com',
      password: 'amonalie',
      assistant: {
        username: 'olmi',
        password: 'olmi'
      }
    },{
      provider: 'local',
      role: 'admin',
      name: 'yuri',
      email: 'yuboski@gmail.com',
      password: 'amonalie',
      assistant: {
        username: 'boschi',
        password: 'boschi'
      }
    },{
      provider: 'local',
      role: 'admin',
      name: 'oga',
      email: 'carlo.indolfi@gmail.com',
      password: 'amonalie',
      assistant: {
        username: 'indolfi',
        password: 'indolfi'
      }
    }, function() {
      console.log('finished populating users');
    }
  );
});
