'use strict';
module.exports = sequelize.define('zu_room', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    uid: Sequelize.STRING,
    room_name: Sequelize.STRING,
    fee: Sequelize.INTEGER,
    description: Sequelize.STRING,
    create_time: Sequelize.BIGINT,
    update_time: Sequelize.BIGINT,
    delete_time: Sequelize.BIGINT,
}, {
    tableName: 'zu_room',
    timestamps: false
});
