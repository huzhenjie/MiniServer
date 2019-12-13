'use strict';

const express = require('express');
const router = express.Router();

const CommonController = require('../controllers/common');

router.post('/feedback', CommonController.addFeedback);

module.exports = router;
