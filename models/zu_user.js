'use strict';
module.exports = sequelize.define('zu_user', {
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
    tel: Sequelize.STRING,
    open_id: Sequelize.STRING,
    nick: Sequelize.STRING,
    avatar: Sequelize.STRING,
    gender: Sequelize.TINYINT,
    user_type: Sequelize.TINYINT,
    create_time: Sequelize.BIGINT,
    update_time: Sequelize.BIGINT,
    delete_time: Sequelize.BIGINT,
}, {
    tableName: 'zu_user',
    timestamps: false
});
