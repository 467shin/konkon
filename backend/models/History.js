const mongoose = require("mongoose");

const historySchema = mongoose.Schema({
  userId: {
    type: String,
  },
  status: {
    type: Number,
    // 0 = 일반 스테이터스
    // 1 = 초기화...
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    maxlength: 50,
  },
  beforeCurrency: {
    type: Array,
  },
  paidCurrency: {
    type: Array,
  },
});

const History = mongoose.model("History", historySchema);

module.exports = { History };
