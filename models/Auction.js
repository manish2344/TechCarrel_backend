const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
  productName: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  currentBid: { 
    type: Number, 
    default: 0 
  },
  highestBidder: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  timer: { 
    type: Number, 
    default: 30 
  },
  sold: { 
    type: Boolean, 
    default: false 
  }
});

module.exports = mongoose.model('Auction', auctionSchema);
