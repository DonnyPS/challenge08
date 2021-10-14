const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
  p1Scors:{
    type: Number,
    required: true
  },
  p2Scors:{
    type: Number,
    required: true
  },
  winner:{
    type: String,
    required: true
  },
  game_room:{
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  }
});

module.exports = mongoose.model('HistoryGame', historySchema);