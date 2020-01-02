'use strict';
module.exports = sequelize.define('cal_countdown', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ts: Sequelize.BIGINT,
    uid: Sequelize.STRING,
    countdown_name: Sequelize.STRING,
    create_time: Sequelize.BIGINT,
    update_time: Sequelize.BIGINT,
    delete_time: Sequelize.BIGINT,
}, {
    tableName: 'cal_countdown',
    timestamps: false
});
