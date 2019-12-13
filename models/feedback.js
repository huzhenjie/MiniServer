'use strict';
module.exports = sequelize.define('feedback', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    app: Sequelize.STRING,
    pt: Sequelize.STRING,
    ch: Sequelize.STRING,
    ver: Sequelize.STRING,
    uid: Sequelize.STRING,
    contract: Sequelize.STRING,
    content: Sequelize.STRING,
    create_time: Sequelize.BIGINT,
}, {
    tableName: 'feedback',
    timestamps: false
});
