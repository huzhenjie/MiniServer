'use strict';
module.exports = sequelize.define('pwd_user', {
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
    username: {
        uniqueKey: true,
        type: Sequelize.STRING,
    },
    pwd: Sequelize.STRING,
    salt: Sequelize.STRING,
    create_time: Sequelize.BIGINT,
    update_time: Sequelize.BIGINT,
    delete_time: Sequelize.BIGINT,
}, {
    tableName: 'pwd_user',
    timestamps: false
});
