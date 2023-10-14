import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { fetchUserProducts, editProduct, deleteProduct } from '../redux/actions/productActions';
import Navbar from './Navbar';
import '../styles/MyProducts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faFloppyDisk, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const MyProducts = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const products = useSelector((state) => state.products.userProducts);
  useEffect(() => {
    // Fetch the user's products when the component mounts
    if (user) {
      dispatch(fetchUserProducts(user._id)); // Pass the user's ID to fetch their products
    }
  }, [user, dispatch]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});

  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditedProduct(product);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProduct({});
  };

  const handleSaveEdit = () => {
    // Dispatch the action to edit the product with the updated data
    dispatch(editProduct(editedProduct._id, editedProduct));
    setIsEditing(false);
  };

  const handleDeleteClick = (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      // Dispatch the action to delete the product
      dispatch(deleteProduct(productId));
    }
  };


  return (
    <div className='edit-container'>
      <div className='Nav'>
        <Navbar user={user}/>
      </div>
    <div className="my-products">
      <h1>My Products</h1>
      <div className="product-list">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          {isEditing && editedProduct._id === product._id ? (
              <div className='post-edit'>
                <div className='cancel'>
                <button onClick={handleCancelEdit}><FontAwesomeIcon icon={faCircleXmark} size='lg'/></button>
                </div>
                <div className='field'>
                <div className='in-field'>
                  Name:
                <input
                  type="text"
                  value={editedProduct.name}
                  onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                /></div>
                <div className='in-field'>
                  Description:
                <input
                  type="text"
                  value={editedProduct.description}
                  onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                /></div>
                <div className='in-field'>
                  Website URL:
                <input
                  type="text"
                  value={editedProduct.website}
                  onChange={(e) => setEditedProduct({ ...editedProduct, website: e.target.value })}
                /></div>
                </div>
                <div className='save'>
                <button onClick={handleSaveEdit}><FontAwesomeIcon icon={faFloppyDisk} size='xl'/></button>
              </div>
              </div>
            ) : (
              <>
              <img src={product.logo} alt={product.name} className="product-card-image"/>
                <div className="product-details">
                <h3 className="product-card-title">{product.name}</h3>
                <p className="product-card-description">{product.description}</p>
                <p className="product-card-category">
                  Categories: {product.categories.join(', ')}
                </p>
                <div className='votes'><p>Upvotes: {product.upvotes}</p>
                <p>Downvotes: {product.downvotes}</p></div>
                </div>
                <div className='editButton'>
                <button onClick={() => handleEditClick(product)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                <button onClick={() => handleDeleteClick(product._id)}><FontAwesomeIcon icon={faTrash} /></button>
                </div>
              </>
            )}
        </div>
      ))}
    </div>
    </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user, // Assuming you have user information in your Redux store
  products: state.products.userProducts, // Assuming you have products information in your Redux store
});

const mapDispatchToProps = {
  fetchUserProducts, // Map the action to fetch user products
  editProduct,
  deleteProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProducts);
