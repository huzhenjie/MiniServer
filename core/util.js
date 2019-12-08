'use strict';

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
    }
};
