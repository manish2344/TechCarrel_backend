const mongoose = require('mongoose');
const Auction = require('../models/Auction');
const User = require('../models/User');

exports.createAuction = async (req, res) => {
  const { productName, description, startingBid } = req.body;

  if (!productName || !startingBid || !description) {
    return res.status(400).json({ message: 'product name, desc, and starting bid are required' });
  }

  try {
    const newAuction = new Auction({
      productName,
      description,
      currentBid: startingBid,
      highestBidder: null,
      timer: 30,
    });

    await newAuction.save();
    res.status(201).json({ message: 'Auction created ', auction: newAuction });
  } catch (error) {
    res.status(500).json({ message: 'Error creating auction', error: error.message });
  }
};

exports.getAuction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid auction ID' });
  }

  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    res.status(200).json(auction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auction', error: error.message });
  }
};

exports.placeBid = async (req, res) => {
  const { auctionId, bidAmount } = req.body;
  const userId = req.user.id;

  if (!auctionId || !bidAmount) {
    return res.status(400).json({ message: 'Auction ID and bid amount are required' });
  }

  if (!mongoose.isValidObjectId(auctionId)) {
    return res.status(400).json({ message: 'Invalid auction ID' });
  }

  try {
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    if (bidAmount <= auction.currentBid) {
      return res.status(400).json({ message: 'Bid must be higher than the current bid' });
    }

    auction.currentBid = bidAmount;
    auction.highestBidder = userId;
    auction.timer = 30;
    await auction.save();

    req.app.get('io').emit('bidUpdate', {
      auctionId: auction._id,
      currentBid: bidAmount,
      highestBidder: userId,
      timer: auction.timer,
      isActive: true,
    });

    res.status(200).json({ message: 'Bid placed successfully', auction });
  } catch (error) {
    res.status(500).json({ message: 'Error placing bid', error: error.message });
  }
};

exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ sold: false });
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auctions', error: error.message });
  }
};

exports.endAuction = async (auctionId, io) => {
  const auction = await Auction.findById(auctionId);

  if (!auction) {
    throw new Error('Auction not found');
  }

  auction.sold = true;
  await auction.save();

  io.emit('auctionEnded', {
    auctionId: auction._id,
    highestBidder: auction.highestBidder,
    isActive: false,
  });

  return auction;
};

exports.buyNow = async (req, res) => {
  const { auctionId } = req.body;
  const userId = req.user.id;

  if (!auctionId) {
    return res.status(400).json({ message: 'Auction ID is required' });
  }

  if (!mongoose.isValidObjectId(auctionId)) {
    return res.status(400).json({ message: 'Invalid auction ID' });
  }

  try {
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    if (auction.highestBidder.toString() !== userId) {
      return res.status(403).json({ message: 'You are not the highest bidder' });
    }

    auction.sold = true;
    await auction.save();

    res.status(200).json({ message: 'Auction purchased successfully', auction });
  } catch (error) {
    res.status(500).json({ message: 'Error processing purchase', error: error.message });
  }
};
