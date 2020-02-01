'use strict';
// const Util = require('../core/util');
// const TokenHelper = require('../core/token_helper');
const InfluenzaNews = require('../model/influenza_news');
const InfluenzaOverview = require('../model/influenza_overview');

function getNewsData(res, id, index, size) {
    let idParam;
    if (!id || id === 0) {
        idParam = {[Sequelize.Op.gte]: 0};
    } else {
        idParam = {[Sequelize.Op.lte]: id};
    }
    if (!index || index < 0) {
        index = 0;
    }
    InfluenzaNews.findAll({
        where: {
            id: idParam,
            delete_time: 0
        },
        order: [
            ['news_time', 'DESC'],
        ],
        offset: parseInt(index),
        limit: parseInt(size)
    }).then(news => {
        res.send({
            code: 200, data: {
                id,
                news,
            }
        })
    })
}

module.exports = {

    getNews: function (req, res) {
        let {id, page, index, size} = req.query;
        if (!size || size <= 0 || size > 30) {
            size = 30;
        }
        if (page) {
            index = (page - 1) * size;
        }
        if (!id) {
            InfluenzaNews.findOne({
                attributes: [
                    ['ifnull(max(id),0)', 'max_id']
                ]
            }).then(maxId => {
                id = maxId.dataValues.max_id;
                getNewsData(res, id, index, size);
            });
        } else {
            getNewsData(res, id, index, size);
        }
    },
    getOverview: function (req, res) {
        InfluenzaOverview.findAll({
            where: {
                delete_time: 0
            },
            order: [
                ['confirmed', 'DESC'],
            ],
        }).then(data => {
            res.send({code: 200, data})
        });
    },
};
