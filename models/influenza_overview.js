'use strict';
module.exports = sequelize.define('influenza_overview', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    country: Sequelize.STRING,
    province: Sequelize.STRING,
    city: Sequelize.STRING,
    confirmed: Sequelize.INTEGER,
    death: Sequelize.INTEGER,
    cure: Sequelize.INTEGER,
    suspected: Sequelize.INTEGER,
    create_time: Sequelize.BIGINT,
    update_time: Sequelize.BIGINT,
    delete_time: Sequelize.BIGINT,
}, {
    tableName: 'influenza_overview',
    timestamps: false
});
