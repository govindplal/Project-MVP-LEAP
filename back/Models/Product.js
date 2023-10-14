// models/Product.js
const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  text: String,
  user: {
    userId: String,
    username: String,
    // ... other user-related fields ...
  },
  createdAt: Date,
});

const commentSchema = new mongoose.Schema({
  commentId: { type: String, unique: true },
  text: String,
  user: {
    userId: String,
    username: String,
    // ... other user-related fields ...
  },
  createdAt: Date,
  replies: [replySchema], // Array of reply objects
});
const productSchema = new mongoose.Schema({
  user: {
    userId: String,
    username: String,
    // ... other user-related fields ...
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  logo: {
    type: Buffer,
  },
  images: [
    {
      type: Buffer,
    },
  ],
  categories: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
  upvotes: {
     type: Number, default: 0 
  },
  downvotes: {
     type: Number, default: 0
  },
  totalVotes: {
     type: Number, default: 0 
  },
  upvoters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  }],
  downvoters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  }],
  comments: [commentSchema], // Array of comment objects
}, { strictPopulate: false });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
