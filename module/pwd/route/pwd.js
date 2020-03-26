'use strict';

const express = require('express');
const router = express.Router();
const PwdUserController = require('../controller/pwd_user_controller');

router.all('/test', PwdUserController.test);
router.post('/login', PwdUserController.appLogin);
// curl -X POST -H 'Content-Type:application/json'  -d '{"username":"test","pwd":"1"}' http://192.168.103.221:8101/pwd/register
router.post('/register', PwdUserController.register);

module.exports = router;
