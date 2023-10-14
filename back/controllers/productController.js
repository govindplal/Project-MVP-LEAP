const Product = require ('../Models/Product');

// Create a new product
const createProduct = async (req, res) => {
try {
    const { name, description, website, categories,userId, username } = req.body;
    const logo = req.files['logo'][0].buffer; // Get the file buffer for logo
    const images = req.files['images'].map((file) => file.buffer); // Get an array of file buffers for images
    const uploadDate = new Date(); // Get the current date as the upload dat

     // Convert binary image data to base64 URLs
     //const logoUrl = `data:image/jpg;base64,${Buffer.from(logo).toString('base64')}`;
     //const imageUrls = images.map((image) => `data:image/jpg;base64,${Buffer.from(image).toString('base64')}`);
    // Create and save the product in the database
    const newProduct = new Product({
      name,
      description,
      website,
      logo,//: logoUrl, // Use the base64 URL for logo
      images,//: imageUrls, // Use base64 URLs for images
      categories: JSON.parse(categories),
      uploadDate,
      user: {
        userId,
        username,
      },
      
    });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Retrieve all products
const getProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find({})// Sort by date in descending order (most recent first)
    
    // Sort products based on the ranking algorithm (e.g., Upvotes - Downvotes)
    products.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    products.sort((a, b) => b.createdAt - a.createdAt);
    //Convert binary image data to base64 URLs for all products
    const productsWithUrls = products.map((product) => ({
      ...product.toObject(),
      logo: `data:image/jpg;base64,${Buffer.from(product.logo).toString('base64')}`,
      images: product.images.map((image) => `data:image/jpg;base64,${Buffer.from(image).toString('base64')}`),
    }))
    res.status(200).json(productsWithUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upvote a product
const upvoteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id; // Assuming you have user authentication in place

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user has already upvoted this product
    const hasUpvoted = product.upvoters.includes(userId);

    if (!hasUpvoted) {
      // User hasn't upvoted, so add the upvote and remove any existing downvote
      product.upvoters.push(userId);
      product.downvoters = product.downvoters.filter((id) => id.toString() !== userId);
      product.upvotes += 1;
      product.totalVotes = product.upvotes - product.downvotes;

    // Save the updated product
    await product.save();
    }
    res.status(200).json({ message: 'Product upvoted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Downvote a product
const downvoteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id; // Assuming you have user authentication in place
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user has already downvoted this product
    const hasDownvoted = product.downvoters.includes(userId);

    if (!hasDownvoted) {
      // User hasn't downvoted, so add the downvote and remove any existing upvote
      product.downvoters.push(userId);
      product.upvoters = product.upvoters.filter((id) => id.toString() !== userId);
      product.downvotes += 1;
      product.totalVotes = product.upvotes - product.downvotes;
    // Save the updated product
    await product.save();
    }
    res.status(200).json({ message: 'Product downvoted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createComment = async (req, res) => {
  try {
    const productId  = req.params.id; // Extract the product ID from the request parameters
    const {text} = req.body.commentData; // Extract comment details from the request body
    const userId = req.user.id;
    const username = req.user.name;
    // Create a new comment object
    const newComment = {
      text,
      user: {
        userId,
        username,
      },
      createdAt: new Date(),
    };

    // Find the product by ID and push the new comment to the comments array
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.comments.push(newComment);

    // Save the updated product with the new comment
    await product.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a reply to a comment
const addReply = async (req, res) => {
  try {
    const productId = req.params.productId;
    const commentId = req.params.commentId;
    const { text } = req.body.replyData;
    const userId = req.user.id; // Assuming you have authentication middleware
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const comment = await (product.comments).find((c) => c._id == commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Create a new reply
    const newReply = {
      text,
      user: {
        userId,
        username: req.user.name, // Assuming you have user data in req.user
      },
      createdAt: new Date(),
    };

    comment.replies.push(newReply);
    await product.save();
    res.status(201).json(newReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getComments = async (req, res) => {
  try {
    
    const productId  = req.params.id; // Extract the product ID from the request parameters
    // Find the product by ID and return its comments
    const product = await Product.findById(productId)
    .populate('products.comments.replies.user', 'username') // Populate user field for replies
      .exec();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const comments = product.comments;
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Retrieve user-specific products
const getUserProducts = async (req, res) => {
  try {

    const userId = req.params.userid; // Assuming you have user authentication in place

    // Fetch products that belong to the user based on their user ID
    const userProducts = await Product.find({ 'user.userId': userId });

    // Sort userProducts based on the ranking algorithm (e.g., Upvotes - Downvotes)
    userProducts.sort((a, b) => b.createdAt - a.createdAt);

    // Convert binary image data to base64 URLs for all userProducts
    const userProductsWithUrls = userProducts.map((product) => ({
      ...product.toObject(),
      logo: `data:image/jpg;base64,${Buffer.from(product.logo).toString('base64')}`,
      images: product.images.map((image) => `data:image/jpg;base64,${Buffer.from(image).toString('base64')}`),
    }));

    res.status(200).json(userProductsWithUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit a product
const editProduct = async (req, res) => {
  try {
    console.log(req.body.updatedProductData);
    const { name, description, website } = req.body.updatedProductData;
    const productId = req.params.id;
    const userId = req.user.id; // Assuming you have user information in the request
    console.log(name, description, website);
    // Check if the product with the given ID exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user is the owner of the product
    if (existingProduct.user.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You are not the owner of this product' });
    }

    // Update the product details
    existingProduct.name = name;
    existingProduct.description = description;
    existingProduct.website = website;

    // Save the updated product
    await existingProduct.save();

    res.status(200).json(existingProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id; // Assuming you have user information in the request

    // Check if the product with the given ID exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user is the owner of the product
    if (existingProduct.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You are not the owner of this product' });
    }

    // Delete the product
    await existingProduct.remove();

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {createProduct, getProducts, upvoteProduct, downvoteProduct, createComment, addReply, getComments, getUserProducts, editProduct, deleteProduct };
// Add more controller functions for reading, updating, and deleting products as needed
