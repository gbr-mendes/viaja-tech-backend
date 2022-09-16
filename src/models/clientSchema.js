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
  websiteVisits: {
    type: Number,
    default: 1,
  },
  destinationsVisited: {
    type: [
      {
        type: String,
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model("Client", clientSchema);
