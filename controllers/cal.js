'use strict';
const WxHelper = require('../core/wx_helper');
const CalUser = require('../models/cal_user');
const CalEvt = require('../models/cal_evt');
const Util = require('../core/util');
const TokenHelper = require('../core/token_helper');
module.exports = {

    userInterceptor: function (req, res, next) {
        const {openid, uid, token} = req.headers;
        if (!openid || !token || !uid) {
            console.error('接口拦截，header不正确', req.headers);
            return res.send({
                code: 4403,
                msg: '请重新授权'
            })
        }

        const {open_id, create_ts} = TokenHelper.verifyToken(token);
        if (openid !== open_id) {
            console.error('接口拦截，openid不正确', token);
            return res.send({
                code: 4403,
                msg: '请重新授权'
            })
        }
        next();
    },

    /**
     * {
            "code": "043xqR582RDcoL052D782u1C582xqR52",
            "userInfo": {
              "nickName": "376744788",
              "gender": 1,
              "language": "zh_CN",
              "city": "Guangzhou",
              "province": "Guangdong",
              "country": "China",
              "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/7SPAC4SM1h5CyOCvv119r2Z5qVnlM3mTyBV6VSvXQHvnCGrugVnfKicuZFsMH8xS9AXPvlkC4tFXN9a3FeBFoicw/132"
            }
        }
     */
    userRegister: function (req, res) {
        const {code, userInfo} = req.body;
        // console.log(req.body);
        WxHelper.code2Session(Config.wx.appId, Config.wx.appSecret, code, ({session_key, openid}) => {
            // console.log('session_key', session_key);
            // console.log('openid', openid);
            CalUser.findOne({where: {open_id: openid}}).then(function (user) {
                if (!user) {
                    const uid = Util.randomStr();
                    CalUser.create({
                        uid: uid,
                        open_id: openid,
                        nick: userInfo.nickName,
                        avatar: userInfo.avatarUrl,
                        gender: userInfo.gender,
                        create_time: new Date().getTime()
                    }).then(row => {
                        const token = TokenHelper.createToken({
                            uid,
                            open_id: openid,
                            create_ts: new Date().getTime()
                        });
                        res.send({
                            code: 200,
                            msg: 'ok',
                            data: {
                                uid,
                                token,
                                open_id: openid
                            }
                        })
                    }).catch(err => {
                        const errMsg = '创建用户失败';
                        console.error(errMsg, err);
                        res.send({
                            code: 500,
                            msg: errMsg
                        })
                    })
                } else {
                    const token = TokenHelper.createToken({
                        uid: user.uid,
                        open_id: openid,
                        create_ts: new Date().getTime()
                    });
                    res.send({
                        code: 200,
                        msg: 'ok',
                        data: {
                            uid: user.uid,
                            token,
                            open_id: openid
                        }
                    })
                }
            }).catch(err => {
                const errMsg = '查询用户信息失败';
                console.error(errMsg, err);
                res.send({
                    code: 500,
                    msg: errMsg
                })
            });
        }, (err, response, body) => {
            const errMsg = '请求微信服务器失败';
            console.error(errMsg, body);
            res.send({
                code: 500,
                msg: errMsg
            })
        });
    },

    getTmpList: function (req, res) {
        res.send({
            code: 200,
            msg: 'ok',
            data: [
                {
                    name: '休班',
                    id: 'xiu',
                    description: '-',
                    score: 0,
                    color: '#ff5722',
                },
                {
                    name: '值班',
                    id: 'zhi',
                    description: '15:30~8:00(次日)',
                    score: 1,
                    color: '#607d8b'
                },
                {
                    name: 'X班',
                    id: 'x',
                    description: '-',
                    score: 0,
                    color: '#e91e63'
                },
                {
                    name: 'A班',
                    id: 'a',
                    description: '7:50～15:30',
                    score: 1,
                    color: '#ff9800'
                },
                {
                    name: '文班',
                    id: 'xiu',
                    description: '8:00～12:00，14:30～17:30',
                    score: 2,
                    color: '#8bc34a'
                },
                {
                    name: 'P班',
                    id: 'p',
                    description: '7:50~12:00，15:20～22:00',
                    score: 2,
                    color: '#00bcd4'
                },
                {
                    name: 'N班',
                    id: 'n',
                    description: '22:00~8:00(次日)',
                    score: 3,
                    color: '#9e9e9e'
                },
            ]
        })
    },

    getEvtList: function (req, res) {
        const {uid} = req.headers;
        const {month} = req.query;
        CalEvt.findAll({
            where: {
                dt: {
                    [Sequelize.Op.between]: [`${month}01`, `${month}31`]
                },
                uid: uid,
                delete_time: 0
            },
            order: [
                ['dt', 'ASC'],
                ['update_time', 'ASC']
            ]
        }).then(function (evts) {
            const resArr = {};
            for (let evt of evts) {
                const events = resArr[evt.dt] || [];

                events.push({
                    row_id: evt.id,
                    id: evt.evt_id,
                    name: evt.evt_name,
                    color: evt.color,
                    description: evt.description,
                    score: evt.score
                });

                resArr[evt.dt] = events;
            }
            res.send({
                code: 200,
                msg: 'ok',
                data: resArr
            })
        })
    },

    delEvt: function (req, res) {
        const {uid} = req.headers;
        const {row_id} = req.params;
        const now = new Date().getTime();
        CalEvt.update({
            update_time: now,
            delete_time: now
        }, {
            where: {
                uid,
                id: row_id
            },
            limit: 1
        });
        res.send({code: 200, msg: 'ok'})
    },

    addEvt: function (req, res) {
        const {uid} = req.headers;
        const {dt, evt_id, evt_name, color, description, score} = req.body;
        CalEvt.create({
            dt,
            uid,
            evt_id,
            evt_name,
            color,
            description,
            score,
            create_time: new Date().getTime()
        }).then(row => {
            res.send({
                code: 200,
                msg: 'ok'
            })
        }).catch(err => {
            const errMsg = '添加事件失败';
            console.error(errMsg, err);
            res.send({
                code: 500,
                msg: errMsg
            })
        })
    },

    updateEvt: function (req, res) {

    },

    deleteEvt: function (req, res) {

    },

    test: function (req, res) {
        // const code = '043xqR582RDcoL052D782u1C582xqR52';
        // WxHelper.code2Session(Config.wx.appId, Config.wx.appSecret, code, ({session_key, openid}) => {
        //     console.log('session_key', session_key);
        //     console.log('openid', openid);
        // }, (err, res, body) => {
        //     console.error('get session fail ', body)
        // });
        res.send({
            code: 200,
            msg: 'ok',
            data: {
                headers: req.headers,
                url: req.url,
                path: req.path,
                origin_url: req.originalUrl,
                hostname: req.hostname,
                ip: req.ip,
                method: req.method,
                params: req.params,
                body: req.body,
                query: req.query,
                random_str: Util.randomStr(),
                server_ts: new Date().getTime()
            }
        })
    }
};
