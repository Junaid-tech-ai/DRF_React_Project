import React, { useState } from 'react';
import axios from 'axios';
import './ImageResizer.css';

function ImageResizer() {
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [resizedImage, setResizedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator
    const formData = new FormData();
    formData.append('image', image);
    formData.append('width_px', width);
    formData.append('height_px', height);
    formData.append('format', 'jpg')
    console.log(formData, 'formdata')
    
    try {
      const response = await axios.post('https://image-resizer-201-27cc71e9bc62.herokuapp.com/imageresizer/resizeimage/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          
        }
        // responseType: 'arraybuffer'
      });
      console.log('Response data:', response);
      // const blob = new Blob([response.data], { type: 'image/jpeg' });

      // // Create a FileReader to read the blob as a data URL
      // const reader = new FileReader();
      // reader.onload = () => {                               (THis comment code is used to load bytearray image from API)
      //   // Set the data URL in the component state
      //   setResizedImage(reader.result);
      // };
      // reader.readAsDataURL(blob);
      setResizedImage(response.data.data.link)
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error resizing image:', error);
      setError('An error occurred while resizing the image. Please try again.'); // Display error message
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="image-resizer-container">
      <h1>Image Resizer</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} />
        <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="Width" />
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height" />
        <button type="submit" disabled={loading}>
          {loading ? 'Resizing...' : 'Resize Image'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      
      {resizedImage && <img src={resizedImage} alt="Resized" className="resized-image" />}
    </div>
  );
}

export default ImageResizer;
