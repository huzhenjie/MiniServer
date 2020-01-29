'use strict';
module.exports = sequelize.define('influenza_news', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: Sequelize.STRING,
    summary: Sequelize.STRING,
    url: Sequelize.STRING,
    source_info: Sequelize.STRING,
    news_time: Sequelize.BIGINT,
    create_time: Sequelize.BIGINT,
    update_time: Sequelize.BIGINT,
    delete_time: Sequelize.BIGINT,
}, {
    tableName: 'influenza_news',
    timestamps: false
});
