const mongoose = require('mongoose')

const orderCategorySchema = new mongoose.Schema({
    orderId: {
        type: String
    },
    companyId:{
        type: String
    },
    name: {
        type: String
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, {
    timestamps: true
})

const OrderCategory = mongoose.model('OrderCategory', orderCategorySchema);

module.exports = OrderCategory;