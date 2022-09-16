const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  packageId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  qtdDays: {
    type: Number,
    default: 1,
  },
  purchaseValue: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Sale", saleSchema);
