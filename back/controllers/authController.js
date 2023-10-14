// Controller for user registration and login
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new user
const registerUser = async (req, res) => {
  try {
    // Check if the email is already registered
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Create a new user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(req.body.password, salt);

    // Save the user to the database
    await newUser.save();

    // Create and send a JWT token
    const payload = { user: { id: newUser.id, name: newUser.name } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7h' }, (err, token) => {
      if (err) throw err;
      res.json({ message:'User Registered Successfully',token,newUser});
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and send a JWT token
    const payload = { user: { id: user.id, name: user.name } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7h' }, (err, token) => {
      if (err) throw err;
      res.status(200).json({message:'Login Successful', token, user });
      // After successful login, store the token in localStorage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };