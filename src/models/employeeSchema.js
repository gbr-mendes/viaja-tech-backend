const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    salary: {
        type: Number,
        default: 1500
    },
    position: {
        type: String,
        enum: ['Sales Manager', 'General Manager', 'Content Manager']
    }
})

module.exports = mongoose.model('Employee', employeeSchema)
