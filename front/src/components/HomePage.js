import React, { useEffect , useState} from 'react';
import { connect,useDispatch, useSelector } from 'react-redux';
import { fetchProducts, upvoteProduct, downvoteProduct } from '../redux/actions/productActions';
import { format, isToday } from 'date-fns';
import ProductCard from './ProductCard'; // Import your ProductCard component
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import '../styles/HomePage.css';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading, error} = useSelector((state) => state.products);
  const {user} = useSelector((state) => state.auth);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to track selected product
  const [isProductModalOpen, setProductModalOpen] = useState(false); // State to control modal visibility
  console.log(user);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleUpvote = (productId) => {
    dispatch(upvoteProduct(productId));
  };

  const handleDownvote = (productId) => {
    dispatch(downvoteProduct(productId));
  };

  if (loading) {
    // Loading state while products are being fetched
    return <p>Loading...</p>;
  }

  if (error) {
    // Error state if there was an issue fetching products
    return <p>Error: {error.message}</p>;
  }

  // Group products by date
  const groupedProducts = groupProductsByDate(products);

  // Function to open the ProductCard modal
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  // Function to close the ProductCard modal
  const closeProductModal = () => {
    setSelectedProduct(null);
    setProductModalOpen(false);
  };


  return (
    <div className='home-container'>
      <div className='Nav'>
        <Navbar user={user}/>
      </div>
    <div className="homepage">
      <div className="header">
        <h1>Welcome to MVP Leap!</h1>
        <p>The place to launch your Minimum Viable Products</p>
      </div>
      {Object.keys(groupedProducts).map((date) => (
        <div key={date} className="date-section">
          <h2>{getDateHeading(date)}</h2>
          <div className="product-cards">
            {groupedProducts[date].map((product) => (
              <div key={product._id} className="product-card-container"
              onClick={() => openProductModal(product)} // Open modal on product click
              >
                <img src={product.logo} alt={product.name} className="product-card-image"/>
                <div className="product-details">
                <h3 className="product-card-title">{product.name}</h3>
                <p className="product-card-description">{product.description}</p>
                <p className="product-card-category">
                  Categories: {product.categories.join(', ')}
                </p>
                </div>
                <div className="product-card-footer">
                  <div className="product-card-buttons">
                    <button
                      onClick={() => handleUpvote(product._id)}
                      className="product-card-button"
                    >
                      <FontAwesomeIcon icon={faCaretUp} size='xl' role='button'/>
                    </button>
                  </div>
                  <div className="product-card-votes">
                    {product.totalVotes}
                  </div>
                  <div className="product-card-buttons">
                    <button
                      onClick={() => handleDownvote(product._id)}
                      className="product-card-button"
                    >
                      <FontAwesomeIcon icon={faCaretDown} size='xl' role='button'/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Modal for displaying full details of a selected product */}
      {/* ProductCard modal */}
      {selectedProduct && (
        <ProductCard
          product={selectedProduct}
          isOpen={isProductModalOpen}
          closeModal={closeProductModal}
        />
      )}
    </div>
    </div>
  );
};

// Helper function to group products by date
const groupProductsByDate = (products) => {
  const grouped = {};
  products?.forEach((product) => {
    const createdAt = new Date(product.createdAt);
    const formattedDate = isToday(createdAt)
      ? "Today's Products"
      : format(createdAt, 'EEEE, dd-MM-yyyy'); // Adjust the format as needed

    if (!grouped[formattedDate]) {
      grouped[formattedDate] = [];
    }
    grouped[formattedDate].push(product);
  });
  return grouped;
};

// Helper function to format date heading
const getDateHeading = (date) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return date === today ? "Today's Products" : date;
};

const mapStateToProps = (state) => ({
  products: state.products,
  loading: state.loading,
  error: state.error,
  upvotedProducts: state.products.upvotedProducts,
  downvotedProducts: state.products.downvotedProducts,
  user : state.auth,
});

export default connect(mapStateToProps, { fetchProducts, upvoteProduct, downvoteProduct })(HomePage);
