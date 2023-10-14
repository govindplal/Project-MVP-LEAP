import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { submitProduct } from '../redux/actions/productActions';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import '../styles/ProductSubmissionForm.css';
import Navbar from './Navbar';

const ProductSubmissionForm = ({ submitProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    categories: [],
    userId: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
  });

  const [logoFile, setLogoFile] = useState(null);
  const [imagesFiles, setImagesFiles] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileDrop = (acceptedFiles, fieldName) => {
    if (fieldName === 'logo') {
      setLogoFile(acceptedFiles[0]);
    } else if (fieldName === 'images') {
      setImagesFiles([...imagesFiles, ...acceptedFiles]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('website', formData.website);
    productData.append('categories', JSON.stringify(formData.categories));
    productData.append('userId', formData.userId);
    productData.append('username', formData.username);

    if (logoFile) {
      productData.append('logo', logoFile);
    }

    imagesFiles.forEach((file) => {
      productData.append('images', file);
    });

    try {
      await submitProduct(productData);
      navigate('/home'); // Redirect to the homepage after successful submission
    } catch (error) {
      console.error(error);
      // Handle submission error
    }
  };

  return (
    <div className="submit-container">
      <div className='Nav'>
        <Navbar user={user}/>
      </div>
    <div className="product-submission-form">
      <h2>Submit a New Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="text"
          placeholder="Product Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="url"
          placeholder="Website URL"
          name="website"
          value={formData.website}
          onChange={handleChange}
          required
          className="form-input"
        />
        <Dropzone onDrop={(acceptedFiles) => handleFileDrop(acceptedFiles, 'logo')}>
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone">
              <div {...getRootProps()} className="dropzone-content">
                <input {...getInputProps()} />
                <p>Drop product logo here, or click to select file</p>
              </div>
            </div>
          )}
        </Dropzone>
        <Dropzone onDrop={(acceptedFiles) => handleFileDrop(acceptedFiles, 'images')}>
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone">
              <div {...getRootProps()} className="dropzone-content">
                <input {...getInputProps()} />
                <p>Drop product images here, or click to select files</p>
              </div>
            </div>
          )}
        </Dropzone>
        <button type="submit" className="form-submit-button">
          Submit
        </button>
      </form>
    </div>
    </div>
  );
};

export default connect(null, { submitProduct })(ProductSubmissionForm);
