const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  value: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Memory', memorySchema);
