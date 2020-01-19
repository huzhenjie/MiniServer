'use strict';
const Feedback = require('../models/feedback');
module.exports = {
    addFeedback: function (req, res) {
        const {app, pt, ch, ver, uid, contract, content} = req.body;
        Feedback.create({
            app, pt, ch, ver, uid, contract, content,
            create_time: new Date().getTime()
        });
        res.send({code: 200})
    },
    getFeedbackList: function (req, res) {
        let {index, size} = req.query;
        if (!index) {
            index = 0
        }
        if (!size || size <= 0 || size > 60) {
            size = 60;
        }
        Feedback.findAll({
            offset: parseInt(index),
            limit: parseInt(size),
            order: [
                ['create_time', 'DESC']
            ]
        }).then(function (feedbacks) {
            res.send({code: 200, data: feedbacks});
        });
    }
};
