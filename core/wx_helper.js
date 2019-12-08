'use strict';
const Request = require('request');
module.exports = {
    // return sample
    // {"session_key":"lfS9HBWMHKF\\/K5WFXGOA0Q==","openid":"o1FKL5QYQ53GvyIGrYx6faUH4Vho"}
    code2Session: function (appId, secret, jsCode, success, fail) {
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${jsCode}&grant_type=authorization_code`;
        Request.get({url}, (err, res, body) => {
            if (!err && body) {
                const resData = JSON.parse(body);
                if (!resData.errcode) {
                    return success && success(resData)
                }
            }
            console.error(err, res, body);
            fail && fail(err, res, body)
        })
    }
};
