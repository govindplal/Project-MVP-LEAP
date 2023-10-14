import React, { useState } from 'react';
import { connect } from 'react-redux';
import { loginUser, registerUser } from '../redux/actions/authActions';
import { useNavigate } from 'react-router';
import '../styles/Auth.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faIdCard, faRightToBracket } from '@fortawesome/free-solid-svg-icons';


const Auth = ({ loginUser, registerUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isRegistering: false, // Added state to track if the user is registering
  });

  const { name, email, password, isRegistering } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleRegistration = () => {
    setFormData({ ...formData, isRegistering: !isRegistering });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      await registerUser({ name, email, password });
      navigate('/home');
    } else {
      await loginUser({ email, password });
      navigate('/home');
    }
  };

  return (
    <div className={`auth-container ${isRegistering ? 'registering' : 'logging'}`}>
      <div className='auth'>
      <div className="auth-form-container">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegistering && (
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
          <div className='submit'><button type="submit" className="auth-button">
            {isRegistering ? <div><FontAwesomeIcon icon={faIdCard} size='lg'/> Sign Up</div> : <div><FontAwesomeIcon icon={faRightToBracket} size='lg'/> Login</div>}
          </button></div>
        </form>
        <div className="auth-toggle-container">
        <div onClick={toggleRegistration} className="auth-toggle">
          {isRegistering ? 
          <>
          <p className='toggle'>Already have an account?
          Please<span>login</span>here.</p>
          </>: 
          <>
          <p className='toggle'>Don't have an account?
           <span>register</span> here.</p>
                    </>
          }
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default connect(null, { loginUser, registerUser })(Auth);
