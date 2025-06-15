const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  slot1: { type: String, default: "" },
  slot2: { type: String, default: "" }
});

module.exports = mongoose.model('Memory', memorySchema);
