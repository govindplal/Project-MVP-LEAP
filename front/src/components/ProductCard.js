import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Carousel } from 'react-responsive-carousel';
import { connect, useDispatch} from 'react-redux';
import { addComment, addReply, getComments } from '../redux/actions/productActions'; // Import your addComment action
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPaperPlane, faReply, faXmark} from '@fortawesome/free-solid-svg-icons';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import '../styles/ProductCard.css'

const ProductCard = ({ product, isOpen, closeModal }) => {

    const dispatch = useDispatch();
    const comments = product.comments;
    useEffect(() => {
        // Fetch comments for the current product when the modal opens
        if (isOpen) {
          dispatch(getComments(product._id));
        }
      }, [isOpen, dispatch, product._id]);
    
      const [newComment, setNewComment] = useState('');
      const [replyToCommentId, setReplyToCommentId] = useState(null);
      const [newReply, setNewReply] = useState('');

      const handleAddComment = () => {
        // Add a new comment to the current product
        dispatch(addComment(product._id, { text: newComment }));
        setNewComment('');
      };

      const handleAddReply = (commentId) => {
        // Add a new reply to a comment
        dispatch(addReply(product._id, commentId, { text: newReply }));
        setNewReply('');
        setReplyToCommentId(null);
      };
    
  return (
    <Modal
      key={product._id}
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Product Details"
      ariaHideApp={false} // This is needed to prevent a warning
    >
      <div className="product-card">
        <button onClick={closeModal}><FontAwesomeIcon icon={faXmark}/></button>
        <div className="carousel">
        {/* Carousel to display images */}
        <Carousel 
        showArrows infiniteLoop swipeable autoFocus emulateTouch showStatus={false} useKeyboardArrows
        showThumbs={false}>
          {product.images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Image ${index}`} />
            </div>
          ))}
        </Carousel>
        </div>
        <div className="product-details">
          <img src={product.logo} alt={product.name} />
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Categories: {product.categories.join(', ')}</p>
          {/* Additional product details */}
        </div>
          {/* Display comments and replies here */}
          {/* Comments section */}
          <div className="comments-section">
          <h3>Comments </h3>
          <div className="comment-list">
            {comments?.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-info">
                  <p>{comment.user.username}</p>
                  <p>{comment.createdAt}</p>
                </div>
                <p>{comment.text}</p>
                {/* Reply button */}
                <button onClick={() => setReplyToCommentId(comment._id)}><FontAwesomeIcon icon={faReply} size="xs"/>({comment.replies?.length})</button>
                {/* Reply input */}
                {replyToCommentId === comment._id && (
                  <div className="reply-input">
                    <textarea
                      placeholder="Add a reply"
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                    />
                    <button onClick={() => handleAddReply(comment._id)}>Submit</button>
                  </div>
                )}
                {/* Nested replies */}
                <div className="replies">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="reply">
                      <div className="reply-info">
                        <p>{reply.user.username}</p>
                        <p>{reply.createdAt}</p>
                      </div>
                      <p>{reply.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Comment input */}
          <div className='comment-input'>
          <textarea
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}><FontAwesomeIcon icon={faPaperPlane}/></button>
        </div>
        </div>
        </div>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
    products: state.products,
  });

export default connect(mapStateToProps, {getComments, addComment})(ProductCard);
