// const mongoose = require('mongoose');
// const logger = require('./utils/logger.js');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     logger.info('MongoDB connected successfully');
//   } catch (error) {
//     logger.error('MongoDB connection failed:', error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;



const mongoose = require('mongoose');
const uri = "mongodb+srv://manishpanwar682:b0xRfG8xI6TCaq5K@cluster0.zfjja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// process.env.MONGODB_URI
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('mongodb connected'); 
  } catch (error) {
    console.error('connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
