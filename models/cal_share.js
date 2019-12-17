'use strict';
module.exports = sequelize.define('cal_share', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    applicant_uid: Sequelize.STRING,
    owner_uid: Sequelize.STRING,
    state: Sequelize.TINYINT,
    description_auth: Sequelize.TINYINT,
    score_auth: Sequelize.TINYINT,

    create_time: Sequelize.BIGINT,
    update_time: Sequelize.BIGINT,
}, {
    tableName: 'cal_share',
    timestamps: false
});
