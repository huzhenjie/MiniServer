'use strict';
module.exports = sequelize.define('cal_user', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    uid: {
        uniqueKey: true,
        type: Sequelize.STRING,
    },
    open_id: {
        type: Sequelize.STRING
    },
    nick: Sequelize.STRING,
    avatar: Sequelize.STRING,
    gender: Sequelize.TINYINT,
    create_time: Sequelize.BIGINT,
    update_time: Sequelize.BIGINT,
    delete_time: Sequelize.BIGINT,
}, {
    tableName: 'cal_user',
    timestamps: false
});
