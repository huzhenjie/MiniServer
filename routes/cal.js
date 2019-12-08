'use strict';

const express = require('express');
const router = express.Router();

const CalController = require('../controllers/cal');

router.all('/test', CalController.test);
router.post('/register', CalController.userRegister);
router.all('/api/*', CalController.userInterceptor);
router.get('/api/evt/tmp', CalController.getTmpList);
router.post('/api/evt', CalController.addEvt);
router.get('/api/evt', CalController.getEvtList);
router.delete('/api/evt/:row_id', CalController.delEvt);

module.exports = router;
