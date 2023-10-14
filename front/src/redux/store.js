// store.js
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers'; // Import your root reducer here
import ReduxThunk from 'redux-thunk';

const initialState = {};

const middleware = [ReduxThunk];

const store = createStore(
  rootReducer, // Use the combined rootReducer
  initialState,
  applyMiddleware(...middleware)
);

export default store;
