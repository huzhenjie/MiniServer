'use strict';
module.exports = sequelize.define('pwd_token', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    uid: Sequelize.STRING,
    access_token: Sequelize.STRING,
    refresh_token: Sequelize.STRING,
    tp: Sequelize.STRING,
    create_time: Sequelize.BIGINT,
    update_time: Sequelize.BIGINT,
    delete_time: Sequelize.BIGINT,
    access_expire_time: Sequelize.BIGINT,
    refresh_expire_time: Sequelize.BIGINT,
}, {
    tableName: 'pwd_token',
    timestamps: false
});
