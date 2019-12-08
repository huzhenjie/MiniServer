const jwt = require('jsonwebtoken');
module.exports = {
    createToken: function (data) {
        return jwt.sign(data, Config.jwtSecret);
    },
    verifyToken: function (token) {
        return jwt.verify(token, Config.jwtSecret);
    }
};
