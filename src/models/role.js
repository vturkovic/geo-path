const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        default: "user"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, {
    timestamps: true
})

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;