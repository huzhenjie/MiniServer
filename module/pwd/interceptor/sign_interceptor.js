'use strict';

module.exports = {
    postInterceptor: function (req, res, next) {
        let {uid, token, ts} = req.headers;
        const now = new Date().getTime();
        if (!ts || ts > now + 3600000 || ts < now - 3600000) {
            console.error('接口拦截，ts不正确', req.headers);
            return res.send({
                code: 4403
            });
        }
    }
};
