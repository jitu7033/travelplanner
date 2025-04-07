import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// import '../styles/CreateBlogPage.css';
import '../Hotel/styles/CreateBlogPage.css'

const CreateBlogPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    location: '',
    content: '',
    images: [],
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('username', formData.username);
    data.append('name', formData.name);
    data.append('location', formData.location);
    data.append('content', formData.content);
    for (let i = 0; i < formData.images.length; i++) {
      data.append('images', formData.images[i]);
    }

    try {
      await axios.post('http://localhost:3000/api/blogs/add-blog', data);
      alert('Blog added successfully!');
      setFormData({ username: '', name: '', location: '', content: '', images: [] });
      document.getElementById('image-input').value = ''; // Reset file input
      navigate('/blog'); // Redirect to BlogPage
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding blog');
    }
  };
  return (
    <div className="create-blog-page-container">
      <nav className="navbar">
        <div className="logo">
          <h2>T</h2>
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/hotels">Hotels</Link>
          <Link to="/oyo">OYO</Link>
          <Link to="/adventure">Adventure</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/create-blog">Create Blog</Link>
        </div>
      </nav>

      <div className="create-blog-container">
        <h1 className="create-blog-title">📝 Create a New Blog</h1>

        <form onSubmit={handleSubmit} className="create-blog-form">
          <input
            type="text"
            name="username"
            placeholder="User Name"
            value={formData.userId}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Blog Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="content"
            placeholder="Blog Content"
            value={formData.content}
            onChange={handleInputChange}
            required
          />
          <input
            type="file"
            id="image-input"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <button type="submit">Add Blog</button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;