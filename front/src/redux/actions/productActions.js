import axios from 'axios';
// Action to indicate the start of a product submission request
const submitProductRequest = () => ({
  type: 'SUBMIT_PRODUCT_REQUEST',
});

// Action to handle successful product submission
const submitProductSuccess = (product) => ({
  type: 'SUBMIT_PRODUCT_SUCCESS',
  payload: product,
});

// Action to handle product submission failure
const submitProductFailure = (error) => ({
  type: 'SUBMIT_PRODUCT_FAILURE',
  payload: error,
});

// Action to request fetching products
const fetchProductsRequest = () => ({
  type: 'FETCH_PRODUCTS_REQUEST',
});

// Action to handle successful product fetching
const fetchProductsSuccess = (products) => ({
  type: 'FETCH_PRODUCTS_SUCCESS',
  payload: products,
});

// Action to handle product fetching failure
const fetchProductsFailure = (error) => ({
  type: 'FETCH_PRODUCTS_FAILURE',
  payload: error,
});

// Action to upvote a product
const upvoteProductSuccess = (product) => ({
  type: 'UPVOTE_PRODUCT_SUCCESS',
  payload: product,
});

// Action to handle upvoting a product failure
const upvoteProductFail = (error) => ({
  type: 'UPVOTE_PRODUCT_FAIL',
  payload: error,
});

// Action to downvote a product
const downvoteProductSuccess = (product) => ({
  type: 'DOWNVOTE_PRODUCT_SUCCESS',
  payload: product,
});

// Action to handle downvoting a product failure
const downvoteProductFail = (error) => ({
  type: 'DOWNVOTE_PRODUCT_FAIL',
  payload: error,
});

// Action to add a comment to a product
const addCommentSuccess = (productId, commentData) => ({
  type: 'ADD_COMMENT_SUCCESS',
  payload: { productId, commentData },
});
const addCommentFail = (error) => ({
  type: 'ADD_COMMENT_FAIL',
  payload: error,
});
// Action to add a reply to a product
const addReplySuccess = (productId,commentId, replyData) => ({
  type: 'ADD_REPLY_SUCCESS',
  payload: { productId,commentId, replyData },
});
const addReplyFail = (error) => ({
  type: 'ADD_REPLY_FAIL',
  payload: error,
});

// Action to fetch comments for a product
 const getCommentsSuccess = (productId, comments) => ({
  type: 'GET_COMMENTS_SUCCESS',
  payload: {productId,comments},
});
 const getCommentsFail = (error) => ({
  type: 'GET_COMMENTS_FAIL',
  payload: error,
});

// Action to handle successful user-specific product fetching
const fetchUserProductsSuccess = (products) => ({
  type: 'FETCH_USER_PRODUCTS_SUCCESS',
  payload: products,
});

// Action to handle user-specific product fetching failure
const fetchUserProductsFailure = (error) => ({
  type: 'FETCH_USER_PRODUCTS_FAILURE',
  payload: error,
});

export const EDIT_PRODUCT_SUCCESS = 'EDIT_PRODUCT_SUCCESS';
export const EDIT_PRODUCT_FAILURE = 'EDIT_PRODUCT_FAILURE';

export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_FAILURE = 'DELETE_PRODUCT_FAILURE';

// Action to submit a product
export const submitProduct = (productData) => async (dispatch) => {
  dispatch(submitProductRequest()); // Dispatch the request action
  try {
    const response = await axios.post('http://localhost:5000/api/products/submit', productData)

    // Dispatch success action and pass the response data
    dispatch(submitProductSuccess(response.data));
  } catch (error) {
    // Dispatch failure action and pass the error
    dispatch(submitProductFailure(error.response.data));
  }
};

// Action to fetch products from the API
export const fetchProducts = () => async (dispatch) => {
  dispatch(fetchProductsRequest()); // Dispatch the request action
  try {
    // Make an API request to fetch products
    const response = await axios.get('http://localhost:5000/api/products/fetch');
    // Dispatch success action and pass the fetched products
    dispatch(fetchProductsSuccess(response.data));
  } catch (error) {
    // Dispatch failure action and pass the error
    dispatch(fetchProductsFailure(error));
  }
};

export const upvoteProduct = (productId) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const response = await axios.put(`http://localhost:5000/api/products/${productId}/upvote`, {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json', // Replace 'token' with the actual token value
      },
    });
    dispatch(upvoteProductSuccess(response.data));
  } catch (error) {
    dispatch(upvoteProductFail(error));
    // Handle the error
  }
};

export const downvoteProduct = (productId) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    const response = await axios.put(`http://localhost:5000/api/products/${productId}/downvote`, {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json', // Replace 'token' with the actual token value
      },
    });
    dispatch(downvoteProductSuccess(response.data));
  } catch (error) {
    dispatch(downvoteProductFail(error));
    // Handle the error
  }
};

// Action to add a comment to a product
export const addComment = (productId, commentData) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    const response = await axios.post(`http://localhost:5000/api/products/${productId}/comments`, {
      commentData, // Pass comment data to the server
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json', // Replace 'token' with the actual token value
      },
    });
    // Dispatch a success action if needed
    
    dispatch(addCommentSuccess(productId, response.data));
  } catch (error) {
    // Dispatch an error action if needed
    dispatch(addCommentFail(error));
  }
};


// Action to add a reply to a product
export const addReply = (productId, commentId, replyData) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    console.log(commentId);
    const response = await axios.post(`http://localhost:5000/api/products/${productId}/comments/${commentId}/replies`, {
      replyData, // Pass reply data to the server
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json', // Replace 'token' with the actual token value
      },
    });
    // Dispatch a success action if needed
    console.log(response);
    dispatch(addReplySuccess(productId, commentId, response.data));
  } catch (error) {
    // Dispatch an error action if needed
    dispatch(addReplyFail(error));
  }
};

// Action to fetch comments for a product
export const getComments = (productId) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/products/${productId}/comments`);
    // Dispatch a success action with the retrieved comments if needed
     dispatch(getCommentsSuccess(productId, response.data));
  } catch (error) {
    // Dispatch an error action if needed
    dispatch(getCommentsFail(error));
  }
};

// Action to fetch products for a specific user
export const fetchUserProducts = (userId) => async (dispatch) => {
  try {
    console.log(userId);
    const response = await axios.get(`http://localhost:5000/api/products/${userId}/user`);
    // Dispatch success action and pass the fetched user-specific products
    dispatch(fetchUserProductsSuccess(response.data));
  } catch (error) {
    // Dispatch failure action and pass the error
    dispatch(fetchUserProductsFailure(error));
  }
};

// Action to edit a product
export const editProduct = (productId, updatedProductData) => async (dispatch) => {

  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`http://localhost:5000/api/products/${productId}/edit`, {
      updatedProductData,
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json', // Replace 'token' with the actual token value
      },
    }); // Adjust the API endpoint
    dispatch({
      type: EDIT_PRODUCT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({ type: EDIT_PRODUCT_FAILURE, payload: error });
  }
};

// Action to delete a product
export const deleteProduct = (productId) => async (dispatch) => {

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/products/${productId}/delete`,{
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json', // Replace 'token' with the actual token value
      },
    }); // Adjust the API endpoint
    dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: productId });
  } catch (error) {
    dispatch({ type: DELETE_PRODUCT_FAILURE, payload: error });
  }
};