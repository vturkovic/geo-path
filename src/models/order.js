const mongoose = require('mongoose')
const Company = require("./company");

const orderSchema = new mongoose.Schema({
    origin: {
        type: String
    },
    destination: {
        type: String
    },
    originCoords:{
        type: Object
    },
    company:{
        type: String,
    },
    completed: {
        type: Boolean,
        default: false
    },
    processed: {
        type: Boolean,
        default: false
    },
    unsuccessful: {
        type: Boolean,
        default: false
    },
    category:{
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;