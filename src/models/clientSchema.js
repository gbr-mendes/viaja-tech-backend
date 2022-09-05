const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  spending: {
    type: Number,
    required: true,
  },
  lastPurchase: {
    type: Date,
    default: Date.now(),
  },
  websiteVisites: {
    type: Number,
    default: 1,
  },
  destinationsVisited: {
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
        ],
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model("Client", clientSchema);
