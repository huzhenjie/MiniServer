'use strict';

const express = require('express');
const Sequelize = require('sequelize');
const index = express();
const bodyParser = require('body-parser');

index.use(bodyParser.urlencoded({extended: false}));
index.use(bodyParser.json());
global.Config = require('./config/config_online');

const sequelize = new Sequelize(Config.datasource.mysql.database, Config.datasource.mysql.user, Config.datasource.mysql.password, {
    host: Config.datasource.mysql.host,
    port: Config.datasource.mysql.port,
    dialect: 'mysql',
    dialectOptions: {
        // charset: "utf8mb4",
        // collate: "utf8mb4_unicode_ci",
        supportBigNumbers: true,
        bigNumberStrings: true
    },

    pool: {
        maxConnections: 20,
        minConnections: 5,
        idle: 10000
    },

    benchmark: true,
    operatorsAliases: 0
});
sequelize.authenticate()
    .then(() => {
        console.log('[MySQL] 连接成功', 'SUCCESS')
    })
    .catch(err => {
        console.error('[MySQL] 连接失败, 原因', Config.datasource, err)
    });
global.Sequelize = Sequelize;
global.sequelize = sequelize;

Date.prototype.format = function (fmt) { // yyyy/M/d h:mm:ss
    if (!fmt) {
        fmt = 'yyyy/M/d h:mm:ss';
    }
    var weekStr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds(),
        'w': weekStr[this.getDay()]
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt
};

index.use('/cal', require('./routes/cal'));
index.use('/common', require('./routes/common'));

index.listen(Config.port, Config.host, function () {
    console.log(`Visit at http://${Config.host}:${Config.port}`);

    // const CalUser = require('./models/cal_user');
    // CalUser.create({uid: 'xxcasx', open_id:'xop'}).then(res => {
    //     // console.log(res.id);
    //     console.log(res)
    // }).catch(err => {
    //     console.error('xxxxx', err)
    // })
});
