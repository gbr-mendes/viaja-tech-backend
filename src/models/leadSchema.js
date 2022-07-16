const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    websiteVisits: {
        type: Number,
        default: 1,
    },
    destinationsViewed: {
        type: [
            {
                type: String,
                enum: [
                    "Vale do Silício",
                    "Pequim",
                    "Nova York",
                    "Xangai",
                    "Tel Aviv",
                    "Estocolmo",
                    "São Paulo",
                    "Porto Digital",
                    "Serratec",
                    "Florianópolis",
                    "San Pedro Valley",
                    "Campinas",
                ]
            }
        ],
        default: []
    },
    mostViewedDestination: {
        type: String,
        enum: [
            "",
            "Vale do Silício",
            "Pequim",
            "Nova York",
            "Xangai",
            "Tel Aviv",
            "Estocolmo",
            "São Paulo",
            "Porto Digital",
            "Serratec",
            "Florianópolis",
            "San Pedro Valley",
            "Campinas",
        ],
        default: ""
    }
})

module.exports = mongoose.model('Lead', leadSchema)
