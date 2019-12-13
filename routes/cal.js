'use strict';

const express = require('express');
const router = express.Router();

const CalController = require('../controllers/cal');

router.all('/test', CalController.test);
router.post('/register', CalController.userRegister);
router.all('/api/*', CalController.userInterceptor);
router.get('/api/evt/tmp', CalController.getTmpList);
router.get('/api/evt/tmp/:evt_id', CalController.getTmp);
router.delete('/api/evt/tmp/:evt_id', CalController.delTmp);
router.post('/api/evt', CalController.addEvt);
router.get('/api/evt', CalController.getEvtList);
router.get('/api/evt/:id', CalController.getEvt);
router.post('/api/evt/:id', CalController.updateEvt);
router.delete('/api/evt/:id', CalController.delEvt);
router.get('/api/user', CalController.getUserInfo);

module.exports = router;
