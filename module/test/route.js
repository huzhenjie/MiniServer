'use strict';

const express = require('express');
const router = express.Router();

const Controller = require('./controller');

router.get('/test', Controller.test);

module.exports = router;
