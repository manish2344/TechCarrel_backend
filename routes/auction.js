// const express = require('express');
// const { createAuction, placeBid, getAuction, buyNow, getAllAuctions, endAuction } = require('../controllers/auctionController');

// // const { createAuction, placeBid, getAuction, buyNow, getAllAuctions, endAuction } = require('../controllers/auctionController');
// const authMiddleware = require('../middleware/authenticate');
// const router = express.Router();

// // Route to create a new auction
// router.post('/create', authMiddleware, createAuction);
// router.get('/all', authMiddleware, getAllAuctions);

// // // Route to place a bid (only authenticated users can bid)
// router.post('/bid', authMiddleware, placeBid);

// // // Route to get auction details
// router.get('/:id', getAuction);

// // // Route for Buy Now option (only highest bidder)
// router.post('/buy-now', authMiddleware, buyNow);

// router.post('/end/:id', authMiddleware, async (req, res) => {
//   const auctionId = req.params.id;
    
//   try {
//     // Assuming the endAuction function handles the end of an auction and emits the event
//     await endAuction(auctionId, req.app.get('io')); // Pass the socket.io instance if needed
//     res.status(200).json({ message: 'Auction ended successfully.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error ending the auction', error: error.message });
//   }
// });

// module.exports = router;
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
