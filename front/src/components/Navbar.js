import React from 'react'
import { Link,} from 'react-router-dom'
import '../styles/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faHouse, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
const Navbar = ({user}) => {
  if(!user){
    alert('Your session expired. Please login again');
    window.open('http://localhost:3000/auth', "_self");
  }
  return (
    <div className='Nav-container'>
              <div className='profile'><FontAwesomeIcon icon={faUser} />{user?.name}</div>
        <div><Link to={'/home'} className="add-product-link">
        <FontAwesomeIcon icon={faHouse} className='add-button' /> Home
        </Link></div>
        <div><Link to={'/submit'} className="add-product-link">
        <FontAwesomeIcon icon={faPlus} beat className='add-button' /> Add a New Product
        </Link></div>
        <div><Link to={'/myproducts'} className="add-product-link">
        <FontAwesomeIcon icon={faBoxOpen} bounce className='add-button' /> My Products
        </Link></div>
    </div>
    
  )
}

export default Navbar