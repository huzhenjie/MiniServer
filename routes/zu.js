'use strict';

const express = require('express');
const router = express.Router();
const Zu = require('../controllers/zu');

router.post('/register', Zu.userRegister);

router.get('/api/overview', Zu.getOverview);

router.post('/api/room', Zu.addRoom);
router.get('/api/room/:roomId', Zu.getRoom);
router.post('/api/room/:roomId', Zu.updateRoom);
router.delete('/api/room/:roomId', Zu.deleteRoom);

module.exports = router;
