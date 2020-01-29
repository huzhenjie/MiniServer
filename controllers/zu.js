'use strict';
const WxHelper = require('../core/wx_helper');
const Util = require('../core/util');
const TokenHelper = require('../core/token_helper');

const ZuUser = require('../models/zu_user');
const ZuRoom = require('../models/zu_room');
const ZuTenant = require('../models/zu_tenant');

module.exports = {
    userRegister: function (req, res) {
        const {code, userInfo} = req.body;
        WxHelper.code2Session(Config.wx.zu.appId, Config.wx.zu.appSecret, code, ({session_key, openid}) => {
            ZuUser.findOne({where: {open_id: openid}}).then(function (user) {
                const now = new Date().getTime();
                if (!user) {
                    const uid = Util.randomStr();
                    ZuUser.create({
                        uid: uid,
                        open_id: openid,
                        nick: userInfo.nickName,
                        avatar: userInfo.avatarUrl,
                        gender: userInfo.gender,
                        user_type: 'unknown',
                        create_time: now
                    }).then(row => {
                        const token = TokenHelper.createToken({
                            uid,
                            open_id: openid,
                            create_ts: new Date().getTime()
                        });
                        res.send({
                            code: 200,
                            data: {
                                uid,
                                token,
                                open_id: openid
                            }
                        });
                    }).catch(err => {
                        Util.defaultDbError(res, err);
                    });
                } else {
                    ZuUser.update({
                        avatar: userInfo.avatarUrl,
                        gender: userInfo.gender,
                        update_time: now
                    }, {
                        where: {
                            open_id: openid
                        },
                        limit: 1
                    }).catch(err => {
                        console.error('更新用户信息失败', err);
                    });
                    const token = TokenHelper.createToken({
                        uid: user.uid,
                        open_id: openid,
                        create_ts: new Date().getTime()
                    });
                    res.send({
                        code: 200,
                        data: {
                            uid: user.uid,
                            token,
                            open_id: openid
                        }
                    });
                }
            }).catch(err => {
                Util.defaultDbError(res, err);
            })
        });
    },
    getOverview: function (req, res) {
        const {uid} = req.headers;
        ZuRoom.findAll({
            where: {
                uid,
                delete_time: 0
            },
            order: [
                ['create_time', 'DESC']
            ]
        }).then(function (rooms) {
            if (rooms.length === 0) {
                // TODO res empty
            }
            const roomIds = [];
            for (let room of rooms) {
                roomIds.push(room.id);
            }
            ZuTenant.findAll({
                where: {
                    landlord_uid: uid,
                    delete_time: 0,
                    leave_time: 0,
                    room_id: {
                        [Sequelize.Op.in]: Array.from(roomIds)
                    }
                }
            }).then(function (tenants) {

                const checkedIn = [];
                const checkedOut = [];
                for (let room of rooms) {
                    const {id, room_name, fee, description} = room;
                    const currRoom = {id, room_name, fee, description};
                    const currTenants = [];
                    for (let tenant of tenants) {
                        if (room.id === tenant.room_id) {
                            currTenants.push(tenant);
                        }
                    }
                    currRoom.tenants = currTenants;
                    if (currTenants.length > 0) {
                        checkedIn.push(currRoom);
                    } else {
                        checkedOut.push(currRoom);
                    }
                }

                res.send({
                    code: 200,
                    data: {
                        checked_in: checkedIn,
                        checked_out: checkedOut
                    }
                })
            }).catch(err => {
                Util.defaultDbError(res, err);
            })
        }).catch(err => {
            Util.defaultDbError(res, err);
        })
    },
    addRoom: function (req, res) {
        const {uid} = req.headers;
        const {room_name, fee, description} = req.body;
        const create_time = new Date().getTime();
        ZuRoom.create({
            uid,
            room_name,
            fee,
            description,
            create_time
        });
        Util.defaultRes(res);
    },
    updateRoom: function (req, res) {
        const {uid} = req.headers;
        const {roomId} = req.params;
        const {room_name, fee, description} = req.body;
        const update_time = new Date().getTime();
        ZuRoom.update({
            room_name, fee, description, update_time
        }, {
            where: {
                uid,
                id: roomId
            },
            limit: 1
        });
        Util.defaultRes(res);
    },
    getRoom: function (req, res) {
        const {uid} = req.headers;
        const {roomId} = req.params;
        ZuRoom.findOne({
            where: {
                uid,
                delete_time: 0,
                id: roomId
            }
        }).then(function (room) {
            if (!room) {
                const msg = '没有找到相关信息';
                console.error(uid, roomId, msg);
                return res.send({
                    code: 404,
                    msg
                })
            }
            const {id, room_name, fee, description} = room;
            ZuTenant.findAll({
                where: {
                    room_id: roomId,
                    landlord_uid: uid,
                    delete_time: 0,
                    leave_time: 0,
                }
            }).then(function (tenants) {

                res.send({
                    code: 200,
                    data: {
                        id, room_name, fee, description, tenants
                    }
                })

            })
        })
    },
    deleteRoom: function (req, res) {
        const {uid} = req.headers;
        const {roomId} = req.params;
        ZuTenant.findAll({
            where: {
                room_id: roomId,
                landlord_uid: uid,
                delete_time: 0,
                leave_time: 0,
            }
        }).then(function (tenants) {
            if (tenants.length > 0) {
                const msg = '当前还有租客在租，请退租后删除';
                console.error(uid, roomId, msg);
                return res.send({code: 4403, msg});
            }
            const update_time = new Date().getTime();
            ZuRoom.update({
                update_time,
                delete_time: update_time
            }, {
                where: {
                    uid,
                    id: roomId
                },
                limit: 1
            });
            Util.defaultRes(res);
        });
    },
};
