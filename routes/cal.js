'use strict';

const express = require('express');
const router = express.Router();

const CalController = require('../controllers/cal');

router.all('/test', CalController.test);
router.post('/register', CalController.userRegister);
router.all('/api/*', CalController.userInterceptor);

router.get('/api/evt/tmp', CalController.getTmpList);
router.get('/api/evt/tmp/:evt_id', CalController.getTmp);
router.post('/api/evt/tmp/:evt_id', CalController.updateTmp);
router.post('/api/evt/tmp', CalController.addTmp);
router.delete('/api/evt/tmp/:evt_id', CalController.delTmp);

router.post('/api/evt', CalController.addEvt);
router.get('/api/evt', CalController.getEvtList);
router.get('/api/evt/summary', CalController.getEvtSummary);
router.get('/api/evt/:id', CalController.getEvt);
router.post('/api/evt/:id', CalController.updateEvt);
router.delete('/api/evt/:id', CalController.delEvt);

router.post('/api/share/cal', CalController.createShareInfo);
router.put('/api/share/cal/:share_code', CalController.applyShare);
router.post('/api/share/cal/:id', CalController.updateShareState);
router.get('/api/share/cal', CalController.getShareList);
router.get('/api/share/cal/evt', CalController.getShareEvt);

router.get('/api/user', CalController.getUserInfo);

module.exports = router;
