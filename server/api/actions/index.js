/**
 * Created by Leo on 23/02/2015.
 */
'use strict';

var express = require('express');
var controller = require('./actions.controller');

var router = express.Router();

router.get('/', controller.index);

module.exports = router;
