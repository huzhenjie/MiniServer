'use strict';
const WxHelper = require('../core/wx_helper');
const CalUser = require('../models/cal_user');
const CalEvt = require('../models/cal_evt');
const CalEvtTemplate = require('../models/cal_evt_template');
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
        WxHelper.code2Session(Config.wx.cal.appId, Config.wx.cal.appSecret, code, ({session_key, openid}) => {
            // console.log('session_key', session_key);
            // console.log('openid', openid);
            CalUser.findOne({where: {open_id: openid}}).then(function (user) {
                if (!user) {
                    const uid = Util.randomStr();
                    const now = new Date().getTime();
                    CalUser.create({
                        uid: uid,
                        open_id: openid,
                        nick: userInfo.nickName,
                        avatar: userInfo.avatarUrl,
                        gender: userInfo.gender,
                        create_time: now
                    }).then(row => {
                        CalEvtTemplate.bulkCreate([
                            {
                                uid,
                                evt_id: 'xiu',
                                evt_name: '休班',
                                color: '#ff5722',
                                description: '今天休息',
                                score: 0,
                                create_time: now
                            },
                            {
                                uid,
                                evt_id: 'zhi',
                                evt_name: '值班',
                                color: '#607d8b',
                                description: '15:30~8:00(次日)',
                                score: 2,
                                create_time: now
                            },
                            {
                                uid,
                                evt_id: 'x',
                                evt_name: 'X班',
                                color: '#e91e63',
                                description: '',
                                score: 0.5,
                                create_time: now
                            },
                            {
                                uid,
                                evt_id: 'a',
                                evt_name: 'A班',
                                color: '#ff9800',
                                description: '7:50～15:30',
                                score: 1,
                                create_time: now
                            },
                            {
                                uid,
                                evt_id: 'wen',
                                evt_name: '文班',
                                color: '#8bc34a',
                                description: '8:00～12:00，14:30～17:30',
                                score: 0.9,
                                create_time: now
                            },
                            {
                                uid,
                                evt_id: 'p',
                                evt_name: 'P班',
                                color: '#00bcd4',
                                description: '7:50~12:00，15:20～22:00',
                                score: 1.5,
                                create_time: now
                            },
                            {
                                uid,
                                evt_id: 'n',
                                evt_name: 'N班',
                                color: '#9e9e9e',
                                description: '22:00~8:00(次日)',
                                score: 2.5,
                                create_time: now
                            }
                        ]);
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
                        });
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
                this.defaultDbError(res, err);
            })
        }, (err, response, body) => {
            const errMsg = '请求微信服务器失败';
            console.error(errMsg, body);
            res.send({
                code: 500,
                msg: errMsg
            })
        });
    },

    getUserInfo: function (req, res) {
        const {uid} = req.headers;
        CalUser.findOne({
            where: {
                uid,
                delete_time: 0
            }
        }).then(function (user) {
            if (user) {
                res.send({code: 200, msg: 'ok', data: user})
            } else {
                res.send({code: 404, msg: '没有找到相关数据'})
            }
        }).catch(err => {
            this.defaultDbError(res, err);
        })
    },

    getTmpList: function (req, res) {
        const {uid} = req.headers;
        CalEvtTemplate.findAll({
            where: {
                uid,
                delete_time: 0
            },
            order: [
                ['create_time', 'desc']
            ]
        }).then(function (evtTmps) {
            const data = [];
            for (let tmp of evtTmps) {
                data.push({
                    name: tmp.evt_name,
                    id: tmp.evt_id,
                    description: tmp.description,
                    score: tmp.score,
                    color: tmp.color
                })
            }
            res.send({code: 200, msg: 'ok', data});
        }).catch(err => {
            this.defaultDbError(res, err);
        })
    },

    getTmp: function (req, res) {
        const {uid} = req.headers;
        const {evt_id} = req.params;
        CalEvtTemplate.findOne({
            where: {
                uid,
                evt_id,
                delete_time: 0
            }
        }).then(function (evtTmp) {
            if (evtTmp) {
                res.send({code: 200, msg: 'ok', data: evtTmp})
            } else {
                res.send({code: 404, msg: '没有找到相关数据'})
            }
        }).catch(err => {
            this.defaultDbError(res, err);
        })
    },

    updateTmp: function (req, res) {
        const {uid} = req.headers;
        const {evt_id} = req.params;
        const {evt_name, score, description, color} = req.body;
        const update_time = new Date().getTime();
        CalEvtTemplate.update({
            evt_name,
            score,
            description,
            update_time,
            color
        }, {
            where: {
                uid,
                evt_id
            },
            limit: 1
        });
        res.send({code: 200, msg: 'ok'});
    },

    addTmp: function (req, res) {
        const {uid} = req.headers;
        const {evt_name, score, description, color} = req.body;
        const create_time = new Date().getTime();
        CalEvtTemplate.create({
            uid,
            evt_id: Util.randomStr(),
            evt_name,
            color,
            score,
            description,
            create_time
        });
        res.send({code: 200, msg: 'ok'});
    },

    delTmp: function (req, res) {
        const {uid} = req.headers;
        const {evt_id} = req.params;
        const now = new Date().getTime();
        CalEvtTemplate.update({
            update_time: now,
            delete_time: now,
        }, {
            where: {
                uid,
                evt_id
            },
            limit: 1
        });
        res.send({code: 200, msg: 'ok'})
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
        }).catch(err => {
            this.defaultDbError(res, err);
        })
    },

    getEvt: function (req, res) {
        const {uid} = req.headers;
        const {id} = req.params;
        CalEvt.findOne({
            where: {
                id,
                uid,
                delete_time: 0
            }
        }).then(function (evt) {
            if (evt) {
                res.send({code: 200, msg: 'ok', data: evt})
            } else {
                res.send({code: 404, msg: '没有找到相关数据'})
            }
        }).catch(err => {
            this.defaultDbError(res, err);
        })
    },

    defaultDbError: function (res, err) {
        const errMsg = '数据库异常';
        console.error(errMsg, err);
        res.send({
            code: 500,
            msg: errMsg
        })
    },

    delEvt: function (req, res) {
        const {uid} = req.headers;
        const {id} = req.params;
        const now = new Date().getTime();
        CalEvt.update({
            update_time: now,
            delete_time: now
        }, {
            where: {
                uid,
                id
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
                msg: 'ok',
                data: row
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
        const {uid} = req.headers;
        const {id} = req.params;
        const {evt_id, evt_name, color, description, score} = req.body;
        CalEvt.update({
            evt_id,
            evt_name,
            color,
            description,
            score,
            update_time: new Date().getTime()
        }, {
            where: {
                uid,
                id
            }
        });
        res.send({code: 200, msg: 'ok'})
    },
    getEvtSummary: function (req, res) {
        const {uid} = req.headers;
        CalEvt.findAll(
            {
                attributes: [
                    'evt_name', ['floor(dt/100)', 'month'], ['count(1)', 'total_evt'], ['sum(score)', 'total_score']
                ],
                group: ['evt_name', 'month'],
                where: {
                    uid,
                    delete_time: 0
                }
            }
        ).then(function (overviews) {
            const data = {};
            for (let overview of overviews) {
                const {month, evt_name, total_evt, total_score} = overview.dataValues;
                const monthData = data[month] || {};
                const evts = monthData.evts || [];
                evts.push({
                    evt_name, total_evt, total_score
                });
                monthData.evts = evts;
                let totalMonthScore = monthData.total_score || 0;
                monthData.total_score = totalMonthScore + total_score;
                data[month] = monthData;
            }
            res.send({code: 200, msg: 'ok', data})
        }).catch(err => {
            const errMsg = '获取事件统计失败';
            console.error(errMsg, err);
            res.send({
                code: 500,
                msg: errMsg
            })
        })
    },

    test: function (req, res) {
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
