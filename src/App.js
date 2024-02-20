import React, { useState } from 'react';
import axios from 'axios';
import './ImageResizer.css'; // Import your CSS file

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
    formData.append('width', width);
    formData.append('height', height);
    console.log(formData, 'formdata')
    try {
      const response = await axios.post('http://127.0.0.1:8000/imageresizer/resizeimage/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          
        },
        responseType: 'arraybuffer'
      });
      console.log('Response data:', response);
      const blob = new Blob([response.data], { type: 'image/jpeg' });

      // Create a FileReader to read the blob as a data URL
      const reader = new FileReader();
      reader.onload = () => {
        // Set the data URL in the component state
        setResizedImage(reader.result);
      };
      reader.readAsDataURL(blob);

      // let base64ImageString = Buffer.from(response.data, 'binary').toString('base64')

      // setResizedImage(base64ImageString);
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
      {/* {resizedImage && <img src={`data:image/jpeg;base64,${resizedImage}`} alt="Resized" className="resized-image" />} */}
    </div>
  );
}

export default ImageResizer;
