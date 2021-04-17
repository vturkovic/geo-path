const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    user_id: {
        type: String,
    },
    firstName: {
        type: String,
    },
    method: {
        type: String,
    },
    path: {
        type: String,
    },
}, {
    timestamps: true
})

const Log = mongoose.model('Log', logSchema);

module.exports = Log;