'use strict';

const express = require('express');
const router = express.Router();

const InfluenzaController = require('../controllers/influenza');

router.get('/news', InfluenzaController.getNews);
router.get('/overview', InfluenzaController.getOverview);

module.exports = router;
