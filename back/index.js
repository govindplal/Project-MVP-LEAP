const express = require('express');
const {connectDB} = require('./config/config');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = express.Router();

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes')
const multer = require('multer');

const app = express();

// Connect to MongoDB
connectDB();

// Configure multer for handling file uploads
const storage = multer.memoryStorage(); // Use memory storage for files
const upload = multer({ storage });


// Middleware
app.use(cors());
// app.use(express.json());
app.use(morgan('combined'));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', upload.fields([{ name: 'logo' }, { name: 'images' }]), productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
