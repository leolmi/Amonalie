/**
 * Created by Leo on 04/02/2015.
 */
'use strict';

var express = require('express');
var controller = require('./amonalie.controller');

var router = express.Router();

router.get('/', controller.index);
router.put('/:id', controller.update);
router.post('/', controller.manage);
router.post('/assistant', controller.milk);

module.exports = router;
