import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth'; // Import your Auth component
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import ProductSubmissionForm from './components/ProductSubmissionForm';
import MyProducts from './components/MyProducts';

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route exact path="/" element={<LandingPage/>} />
            <Route exact path="/auth" element={<Auth/>} />
            
            {/* Private Routes (protected by authentication) */}
            <Route path="/home" element={<HomePage/>} />
            <Route exact path="/submit" element={<ProductSubmissionForm/>} />
            <Route exact path="/myproducts" element={<MyProducts/>} />
            {/* Add more private routes as needed */}
          </Routes>
        </div>
      </Router>
  );
}

export default App;
