'use strict';
module.exports = sequelize.define('cal_evt_template', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    uid: Sequelize.STRING,
    evt_id: Sequelize.STRING,
    evt_name: Sequelize.STRING,
    color: Sequelize.STRING,
    description: Sequelize.STRING,
    score: Sequelize.FLOAT,
    create_time: Sequelize.BIGINT,
    update_time: Sequelize.BIGINT,
    delete_time: Sequelize.BIGINT,
}, {
    tableName: 'cal_evt_template',
    timestamps: false
});
