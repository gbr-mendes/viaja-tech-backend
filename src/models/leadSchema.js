const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  websiteVisits: {
    type: Number,
    default: 1,
  },
  destinationsViewed: {
    type: [
      {
        type: Object,

        package: {
          type: String,
        },
        tdViews: {
          type: Number,
          default: 0,
        },
      },
    ],
    default: [],
  },
  mostViewedDestination: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Lead", leadSchema);
