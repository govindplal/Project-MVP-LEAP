const express = require('express');
const router = express.Router();
const {createProduct, getProducts,upvoteProduct, downvoteProduct, createComment, addReply, getComments, getUserProducts, editProduct, deleteProduct  } = require('../controllers/productController');
const {authMiddleware} = require('../middlewares/authMiddleware');
// POST a new product
router.post('/submit', createProduct);
router.get('/fetch', getProducts);

// Upvote a product
router.put('/:id/upvote',authMiddleware ,upvoteProduct);

// Downvote a product
router.put('/:id/downvote', authMiddleware, downvoteProduct);
// Add more routes for other product operations (e.g., GET, PUT, DELETE) as needed

//Add comment
router.post('/:id/comments',authMiddleware, createComment);
router.post('/:productId/comments/:commentId/replies',authMiddleware, addReply);
router.get('/:id/comments', getComments);

router.get('/:userid/user', getUserProducts);
router.put('/:id/edit',authMiddleware,editProduct);
router.delete('/:id/delete',authMiddleware, deleteProduct);

module.exports = router;
