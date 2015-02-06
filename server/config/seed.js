/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var Amonalie = require('../api/amonalie/amonalie.model');
var User = require('../api/user/user.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  },function() {
    console.log('finished populating things');
  });
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
    desc:'asdfaf sdf asdfasdfasdfs',
    state: 'fando',
    tasks: [
      {owner:'leo', start:d2_n, end:0, work:''}],
    params: [
      {name:'priority',value:'3'},
      {name:'stima',value:'6'},
      {name:'ref. tech',value:'zanella'}]
  },{
    code:'263115',
    app:'WikiReports',
    desc:'asdfaf sdf asdfasdfasdfs',
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
    desc:'asdfaf sdf asdfasdfasdfs',
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
      password: 'amonalie'
    },{
      provider: 'local',
      role: 'admin',
      name: 'yuri',
      email: 'yuboski@gmail.com',
      password: 'amonalie'
    },{
      provider: 'local',
      role: 'admin',
      name: 'oga',
      email: 'carlo.indolfi@gmail.com',
      password: 'amonalie'
    }, function() {
      console.log('finished populating users');
    }
  );
});
