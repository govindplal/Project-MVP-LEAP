// Actions for user authentication
import axios from 'axios';

export const registerUser = (userData) => async (dispatch) => {
  try {
    // Make API request to register user
    const response = await axios.post('http://localhost:5000/api/auth/register', userData);
    // Dispatch success action
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userId', response.data.user._id);
    localStorage.setItem("username", response.data.user.name);
    dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
  } catch (error) {
    // Dispatch error action
    dispatch({ type: 'REGISTER_FAILURE', payload: error.response.data });
  }
};

export const loginUser = (userData) => async (dispatch) => {
  try {
    // Make API request to log in user
    const response = await axios.post('http://localhost:5000/api/auth/login', userData);
    // Dispatch success action
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userId', response.data.user._id);
    localStorage.setItem("username", response.data.user.name);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
  } catch (error) {
    // Dispatch error action
    dispatch({ type: 'LOGIN_FAILURE', payload: error.response.data });
  }
};
