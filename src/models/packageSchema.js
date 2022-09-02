const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    valuePerDay:{
        type: Number,
        required: true
    },
    mainImage:{
        type:String,
        default: ""
    },
    secodaryImages: {
        type:[
            {
                type:String
            }
        ]
    }
})

module.exports = mongoose.model('Package', packageSchema);