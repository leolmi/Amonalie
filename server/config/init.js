/**
 * Created by Leo on 03/02/2015.
 */
'use strict';

var Target = require('../api/target/target.model');
var User = require('../api/user/user.model');

User.find({}).remove(function() {
  User.create({
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
  },function() {
    console.log('Terminato di brasare gli utenti.');
  });
});

Target.find({}).remove(function() {
  console.log('Terminato di brasare i terget.');
});
