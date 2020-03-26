'use strict';
const Crypto = require('crypto');

module.exports = {
    randomStr: function (length, chars) {
        if (!length) {
            length = 32;
        } else if (length <= 0) {
            return '';
        }
        if (!chars) {
            chars = '0123456789abcdefghijklmnopqrstuvwxyz';
        }
        let result = '';
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    },
    defaultDbError: function (res, err, msg) {
        const errMsg = msg || '数据库异常';
        console.error(errMsg, err);
        res.send({
            code: 500,
            msg: errMsg
        });
    },
    defaultRes: function (res) {
        res.send({code: 200});
    },
    md5: function (origin_str) {
        return Crypto.createHash('md5').update(origin_str).digest('hex');
    }
};
