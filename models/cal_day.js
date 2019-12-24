'use strict';
module.exports = sequelize.define('cal_day', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    dt: Sequelize.INTEGER,
    holiday: Sequelize.STRING,
    statutory_holidays: Sequelize.TINYINT,
    lunar_cal: Sequelize.STRING,
    quote: Sequelize.STRING,
    author: Sequelize.STRING,
    create_time: Sequelize.BIGINT
}, {
    tableName: 'cal_day',
    timestamps: false
});
