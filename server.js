// const express = require('express');
// const http = require('http');
// const dotenv = require('dotenv');
// const socketIo = require('socket.io');
// const cors = require('cors'); // Import cors
// const authRoutes = require('./routes/auth');
// const auctionRoutes = require('./routes/auction');
// const connectDB = require('./db');
// const authMiddleware = require('./middleware/authenticate'); // Import auth middleware
// const User = require('./models/User');
// const Auction = require('./models/Auction'); 

// const app = express();
// const server = http.createServer(app);

// // Set up Socket.IO with CORS configuration
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000", // Allow connections from your React frontend
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type", "Authorization"], // Include any headers you might be sending
//     credentials: true, // Allow credentials (cookies, etc.)
//   },
// });

// // Middleware
// dotenv.config();
// app.use(express.json());

// // Enable CORS for Express routes (optional, but helpful for all routes)
// app.use(cors({
//   origin: "http://localhost:3000", 
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true, 
// }));

// // MongoDB connection
// connectDB();

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/auction', auctionRoutes);

// // WebSocket connections
// io.on('connection', (socket) => {
//   console.log('User connected');

//   // Handling placeBid event with user authentication
//   socket.on('placeBid', async (data) => {
//     // Check user authentication
//     const user = await User.findById(data.userId);
//     if (!user) {
//       return socket.emit('error', { message: 'User not authenticated' });
//     }

//     // Find auction
//     const auction = await Auction.findById(data.auctionId);
//     if (!auction) {
//       return socket.emit('error', { message: 'Auction not found' });
//     }

//     // Ensure the bid is higher than the current bid
//     if (data.bidAmount <= auction.currentBid) {
//       return socket.emit('error', { message: 'Bid must be higher than the current bid' });
//     }

//     // Update auction with new bid details
//     auction.currentBid = data.bidAmount;
//     auction.highestBidder = data.userId;
//     auction.timer = 30; // Reset the timer to 30 seconds after each bid
//     await auction.save();

//     // Emit the updated auction data to all clients
//     io.emit('bidUpdate', {
//       auctionId: data.auctionId,
//       currentBid: auction.currentBid,
//       highestBidder: auction.highestBidder,
//       timer: auction.timer,
//     });

//     // Handle auction timer countdown
//     const timerInterval = setInterval(async () => {
//       auction.timer -= 1;
//       if (auction.timer <= 0) {
//         // Auction ends, declare winner and enable Buy Now
//         clearInterval(timerInterval);
//         auction.isClosed = true; // Close auction
//         const winningUser = await User.findById(auction.highestBidder);
//         // Notify the winning bidder (enabling Buy Now)
//         io.emit('auctionEnd', {
//           auctionId: data.auctionId,
//           winner: winningUser.username,
//           buyNowEnabled: true,
//         });
//       } else {
//         await auction.save(); // Update timer
//         io.emit('timerUpdate', { auctionId: data.auctionId, timer: auction.timer });
//       }
//     }, 1000);
//   });

//   // Handling disconnect
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const cors = require('cors');
const auth = require('./routes/auth');
const auction = require('./routes/auction');
const connectDB = require('./db');
const authMiddleware = require('./middleware/authenticate');
const User = require('./models/User');
const Auction = require('./models/Auction'); 

const app = express();
const server = http.createServer(app);

// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   },
// });

const io = socketIo(server, {
  cors: {
    origin: "*",  // Allows all origins
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

dotenv.config();
app.use(express.json());
app.use(cors())


connectDB();

app.use('/api/auth', auth);
app.use('/api/auction', auction);

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('placeBid', async (data) => {
    const user = await User.findById(data.userId);
    if (!user) {
      return socket.emit('error', { message: 'User not authenticated' });
    }

    const auction = await Auction.findById(data.auctionId);
    if (!auction) {
      return socket.emit('error', { message: 'Auction not found' });
    }

    if (data.bidAmount <= auction.currentBid) {
      return socket.emit('error', { message: 'Bid must be higher than the current bid' });
    }

    auction.currentBid = data.bidAmount;
    auction.highestBidder = data.userId;
    auction.timer = 30;
    await auction.save();

    io.emit('bidUpdate', {
      auctionId: data.auctionId,
      currentBid: auction.currentBid,
      highestBidder: auction.highestBidder,
      timer: auction.timer,
    });

    const timerInterval = setInterval(async () => {
      auction.timer -= 1;
      if (auction.timer <= 0) {
        clearInterval(timerInterval);
        auction.isClosed = true;
        const winningUser = await User.findById(auction.highestBidder);
        io.emit('auctionEnd', {
          auctionId: data.auctionId,
          winner: winningUser.username,
          buyNowEnabled: true,
        });
      } else {
        await auction.save();
        io.emit('timerUpdate', { auctionId: data.auctionId, timer: auction.timer });
      }
    }, 1000);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
