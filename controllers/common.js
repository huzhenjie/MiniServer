'use strict';
const Feedback = require('../models/feedback');
module.exports = {
    addFeedback: function (req, res) {
        const {app, pt, ch, ver, uid, contract, content} = req.body;
        Feedback.create({
            app, pt, ch, ver, uid, contract, content,
            create_time: new Date().getTime()
        });
        res.send({code: 200, msg: 'ok'})
    }
};
