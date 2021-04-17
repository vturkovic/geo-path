const mongoose = require('mongoose')
const Order = require("./order");

const companySchema = new mongoose.Schema({
    oib: {
        type: String
    },
    name: {
        type: String
    },
    address:{
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    users: [
        {
            user: {
                type: Object
            }
    }
    ],
    orders: [
        {
            order: {
                type: Object
            }
    }
    ],
    routes: [
        {
            route: {
                type: Object
            }
    }
]

}, {
    timestamps: true
})

const Company = mongoose.model('Company', companySchema);

module.exports = Company;