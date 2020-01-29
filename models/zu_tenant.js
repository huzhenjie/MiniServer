'use strict';
module.exports = sequelize.define('zu_tenant', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    landlord_uid: Sequelize.STRING,
    room_id: Sequelize.INTEGER,
    idcard: Sequelize.STRING,
    contact_tel: Sequelize.STRING,
    remark_nick: Sequelize.STRING,
    description: Sequelize.STRING,
    fee: Sequelize.INTEGER,
    deposit_fee: Sequelize.INTEGER,
    fee_type: Sequelize.STRING,

    first_fee_time: Sequelize.BIGINT,
    check_in_time: Sequelize.BIGINT,
    check_out_time: Sequelize.BIGINT,
    leave_time: Sequelize.BIGINT,
    create_time: Sequelize.BIGINT,
    update_time: Sequelize.BIGINT,
    delete_time: Sequelize.BIGINT,
}, {
    tableName: 'zu_tenant',
    timestamps: false
});
