import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// import '../styles/BlogPage.css';
import '../Hotel/styles/BlogPage.css'
// import blogImage from ''; // Placeholder image for blogs

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        localStorage.removeItem('blogs'); // Force fresh fetch (temporary)
        const response = await axios.get('http://localhost:3000/api/blogs/get');
        const fetchedBlogs = Array.isArray(response.data) ? response.data : response.data.data || [];
        setBlogs(fetchedBlogs);
        setFilteredBlogs(fetchedBlogs);
        localStorage.setItem('blogs', JSON.stringify(fetchedBlogs));
      } catch (error) {
        console.log('Error fetching blogs: ', error);
      }
    };
    fetchBlogs();
  }, []);
  
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = blogs.filter((blog) =>
      blog.content.toLowerCase().includes(query) ||
      blog.name.toLowerCase().includes(query)
    );
    setFilteredBlogs(filtered);
  };

  const handleViewBlog = (blogId) => {
    navigate(`/blog/${blogId}`); // Navigate to a detailed blog page (optional)
  };

  return (
    <div className="blog-page-container">
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

      <div className="blog-container">
        <h1 className="blog-title">📝 Our Blogs</h1>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search blogs by name or location..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="blog-grid">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => (
              console.log("Blog:", blog.images[0]),
              <div key={blog.id || `blog-${index}`} className="blog-card">
                {/* Display the first image if available, otherwise use a placeholder */}
                <img
                  src={blog.images && blog.images.length > 0 ? `http://localhost:3000${blog.images[0]}` : ''}
                  alt={blog.name}
                  className="blog-image"
                />
                <h2 className="blog-name">{blog.name}</h2>
                <p className="blog-location">📍 {blog.content}</p>
                <p className="blog-content">{blog.location.slice(0, 100)}...</p>
                <button
                  className="view-button"
                  onClick={() => handleViewBlog(blog.id)}
                >
                  Read More 📖
                </button>
              </div>
            ))
          ) : (
            <p className="no-blogs">No blogs found for this search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;