const mongoose = require('mongoose')
const Order = require("./order");

const routeSchema = new mongoose.Schema({
    company: {
        type: String
    },
    driver: {
        type: String
    },
    waypoints: {
        type: Array
    },
    distance:{
        type: Number
    },
    timeDuration:{
        type: Number
    },
    date:{
        type: String
    },
    startTime:{
        type: String
    },  
    orders:{
        type: Array
    },
    category:{
        type: Array
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, {
    timestamps: true
})

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;