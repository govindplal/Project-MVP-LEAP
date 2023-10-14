const dotenv = require('dotenv'); // For handling environment variables
const mongoose = require('mongoose');
dotenv.config(); // Load environment variables from a .env file if needed

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB Connected');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1); // Exit the process on connection failure
    }
  };
  
  module.exports = { connectDB };

// module.exports = {
//   port: process.env.PORT || 5000, // Define your server port
//   mongoURI: process.env.MONGO_URI || 'mongodb://localhost/myapp', // Define your MongoDB connection URI
//   jwtSecret: process.env.JWT_SECRET || 'your-secret-key', // Define your JWT secret key
// };
