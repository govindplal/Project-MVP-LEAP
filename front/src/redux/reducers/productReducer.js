import {
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAILURE,

  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
} from '../actions/productActions';


const initialState = {
    submittedProduct: null, // To store the submitted product data
    products: [], // To store the fetched products
    userProducts: [], // New state property to store user-specific products
    loading: false,
    error: null,
  };
  
  const productReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SUBMIT_PRODUCT_REQUEST':
        return {
          ...state,
          loading: true,
          error: null,
        };
      case 'SUBMIT_PRODUCT_SUCCESS':
        return {
          ...state,
          loading: false,
          submittedProduct: action.payload,
        };
      case 'SUBMIT_PRODUCT_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case 'FETCH_PRODUCTS_REQUEST':
        return {
          ...state,
          loading: true,
          error: null,
        };
      case 'FETCH_PRODUCTS_SUCCESS':
        return {
          ...state,
          loading: false,
          products: action.payload, // Update the products array with the fetched data
        };
      case 'FETCH_PRODUCTS_FAILURE':
        return {
        ...state,
          loading: false,
          error: action.payload,
        };
        case 'UPVOTE_PRODUCT_SUCCESS':
    case 'DOWNVOTE_PRODUCT_SUCCESS':
      const updatedProducts = state.products.map((product) => {
        if (product._id === action.payload._id) {
          return {
            ...product,
            upvotes: action.payload.upvotes,
            downvotes: action.payload.downvotes,
            totalVotes: action.payload.totalVotes,
          };
        }
        return product;
      });

      return {
        ...state,
        products: updatedProducts,
        
      };

    case 'UPVOTE_PRODUCT_FAIL':
    case 'DOWNVOTE_PRODUCT_FAIL':
      return {
        ...state,
        error: action.payload,
      };

    case 'ADD_COMMENT_SUCCESS':
      const updateProducts = state.products.map((product) => {
        if (product._id === action.payload.productId) {
          return {
              ...product,
            comments: [...(product.comments || []), action.payload.commentData],
          };
        }
        return product;
        });
        return {
          ...state,
          products: updateProducts,
        };
    case 'ADD_COMMENT_FAIL':
      return {
        ...state,
        error: action.payload,
      };
    case 'ADD_REPLY_SUCCESS':
      const productsWithReplies = state.products.map((product) => {
        if (product._id === action.payload.productId) {
          const updatedComments = product.comments.map((comment) => {
            if (comment.commentId === action.payload.commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), action.payload.replyData],
              };
            }
            return comment;
          });

          return {
            ...product,
            comments: updatedComments,
          };
        }
        return product;
      });

      return {
        ...state,
        products: productsWithReplies,
      };

    case 'ADD_REPLY_FAIL':
      return {
        ...state,
        error: action.payload,
      };
    case 'GET_COMMENTS_SUCCESS':
      const productsWithComments = state.products.map((product) => {
        if (product._id === action.payload.productId) {
          return {
            ...product,
            comments: action.payload.comments,
          };
        }
        return product;
      });
      return {
        ...state,
        products: productsWithComments,
      };
      case 'GET_COMMENTS_FAIL':
        return {
          ...state,
          error: action.payload,
        };
        case 'FETCH_USER_PRODUCTS_SUCCESS':
      return {
        ...state,
        loading: false,
        userProducts: action.payload, // Store user-specific products
      };
    case 'FETCH_USER_PRODUCTS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
       case EDIT_PRODUCT_SUCCESS:
      // Update the userProducts array with the edited product
      const updatedUserProducts = state.userProducts.map((product) =>
        product._id === action.payload._id ? action.payload : product
      );
      return {
        ...state,
        userProducts: updatedUserProducts,
        loading: false,
      };
    case DELETE_PRODUCT_SUCCESS:
      // Remove the deleted product from the userProducts array
      const filteredUserProducts = state.userProducts.filter(
        (product) => product._id !== action.payload
      );
      return {
        ...state,
        userProducts: filteredUserProducts,
        loading: false,
      };
    case EDIT_PRODUCT_FAILURE:
    case DELETE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      default:
        return state;
    }
  };
  
  export default productReducer;
  