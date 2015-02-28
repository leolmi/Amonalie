'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/list', auth.isAuthenticated(), controller.list);
router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/name/:id', auth.isAuthenticated(), controller.getname);
router.post('/', auth.isAuthenticated(), controller.create);
router.post('/data/:id', auth.isAuthenticated(), controller.data);
router.post('/assistant/:id', auth.isAuthenticated(),  controller.assistant);

module.exports = router;
