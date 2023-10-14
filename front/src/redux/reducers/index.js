// reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './authReducer'; // Import your authReducer here
import productReducer from './productReducer';

const rootReducer = combineReducers({
  auth: authReducer, // Add auth reducer to the root reducer
  products: productReducer,// ...other reducers if you have them
});

export default rootReducer;
