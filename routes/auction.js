const express = require('express');
const { createAuction, placeBid, getAuction, buyNow, getAllAuctions, endAuction } = require('../controllers/auctionController');
const authMiddleware = require('../middleware/authenticate');

const router = express.Router()

router.post('/create', authMiddleware, createAuction)
router.get('/all', authMiddleware, getAllAuctions)
router.post('/bid', authMiddleware, placeBid)
router.get('/:id', getAuction)
router.post('/buy-now', authMiddleware, buyNow)

router.post('/end/:id', authMiddleware, async (req, res) => {
  const auctionId = req.params.id;
  try {
    await endAuction(auctionId, req.app.get('io'))
    res.status(200).json({ message: 'Auction ended successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'Error ending the auction', error: error.message });
  }
});

module.exports = router;
