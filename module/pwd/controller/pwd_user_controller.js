'use strict';
const Util = require('../../../core/util');
const PwdUser = require('../model/pwd_user');
const PwdToken = require('../model/pwd_token');

const createToken = (res, uid) => {
    const now = new Date().getTime();
    const tp = 'app';
    PwdToken.update({
        update_time: now,
        delete_time: now,
    }, {
        where: {
            tp,
            uid,
            [Sequelize.Op.or]: [
                {
                    access_expire_time: {
                        [Sequelize.Op.gte]: now
                    }
                },
                {
                    refresh_expire_time: {
                        [Sequelize.Op.gte]: now
                    }
                }
            ]
        }
    }).then(() => {
        const access_token = Util.randomStr(32);
        const refresh_token = Util.randomStr(32);
        const refresh_token_expire_in = 86400000 * 30;
        const access_token_expire_in = 86400000 * 30;
        PwdToken.create({
            access_token,
            refresh_token,
            tp,
            uid,
            create_time: now,
            access_expire_time: now + access_token_expire_in,
            refresh_expire_time: now + refresh_token_expire_in
        });
        res.send({
            code: 200,
            data: {
                uid,
                access_token,
                refresh_token,
                access_token_expire_in,
                refresh_token_expire_in
            }
        })
    })
};

module.exports = {
    test: function (req, res) {

        PwdToken.update({
            update_time: 111
        }, {
            where: {
                tp: 'app',
                uid: 'xxxa',
                [Sequelize.Op.or]: [
                    {
                        access_expire_time: {
                            [Sequelize.Op.gte]: 999
                        }
                    },
                    {
                        refresh_expire_time: {
                            [Sequelize.Op.gte]: 999
                        }
                    }
                ]
            }
        }).then(() => {
            console.log('success');
            res.json({code: 200});
        });
    },
    appLogin: function (req, res) {
        const {username, pwd} = req.body;
        PwdUser.findOne({where: {username}}).then(user => {
            if (!user) {
                return res.send({code: 10404, msg: '用户不存在'})
            }
            const calcPwd = Util.md5(user.salt + pwd);
            if (calcPwd !== user.pwd) {
                return res.send({code: 10001, msg: '密码不正确'})
            }
            createToken(res, user.uid);
        })
    },
    register: function (req, res) {
        const {username, pwd} = req.body;
        if (!username || !pwd) {
            return res.send({code: 20002, msg: '用户名或密码不能为空'});
        }
        PwdUser.findOne({where: {username}}).then(user => {
            if (user) {
                return res.send({code: 20001, msg: '用户名已存在'});
            }
            const uid = Util.randomStr(32);
            const salt = Util.randomStr(32);
            const calcPwd = Util.md5(salt + pwd);
            const now = new Date().getTime();
            PwdUser.create({
                uid,
                salt,
                username,
                pwd: calcPwd,
                create_time: now
            }).then(row => {
                createToken(res, uid);
            }).catch(err => {
                Util.defaultDbError(res, err);
            })
        }).catch(err => {
            Util.defaultDbError(res, err);
        })
    }
};
