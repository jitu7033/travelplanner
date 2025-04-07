import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./styles/MenuPage.css";

const MenuPage = () => {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [hotel, setHotel] = useState({ name: "", location: "" });
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [content, setContent] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Fetch menu, hotel details, and ratings
  useEffect(() => {
    const fetchMenuAndHotel = async () => {
      try {
        const menuResponse = await axios.get(`http://localhost:3000/api/hotels/${id}/menu`);
        setMenuItems(menuResponse.data);

        const hotelResponse = await axios.get(`http://localhost:3000/api/hotels/${id}/menu`);
        setHotel({
          name: hotelResponse.data.name,
          location: hotelResponse.data.location,
        });
        
        const ratingsResponse = await axios.get(`http://localhost:3000/api/rating/${id}/getRating`);
        setRatings(ratingsResponse.data);
        console.log(ratingsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMenuAndHotel();
  }, [id]);

  console.log(id);
  console.log(ratings);

  // Handle rating submission
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      const ratingData = {
        name: userName,
        rating,
        description: content,
      };

      const response = await axios.post(`http://localhost:3000/api/rating/${id}/addRating`, ratingData);

      if (response.status === 200) {
        alert("Thank you for your rating!");
        const ratingsResponse = await axios.get(`http://localhost:3000/api/rating/${id}/getRating`);
        setRatings(ratingsResponse.data.ratings || ratingsResponse.data); // Adjust based on backend response structure
        setUserName("");
        setRating(0);
        setContent("");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again later.");
    }
  };

  // Helper to render star rating
  const renderStars = (rating) => "⭐".repeat(rating);

  return (
    <div className="menu-page-container">
      {/* Navbar */}
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
        </div>
      </nav>

      {/* Menu Section */}
      <div className="menu-container">
        <h1 className="menu-title">🍽️ Menu for {hotel.name}</h1>
        {menuItems.length > 0 ? (
          <div className="menu-items">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-item">
                <h2 className="item-name">{item.name}</h2>
                <p className="item-description">{item.description}</p>
                <p className="item-price">${item.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-menu">No menu available for this hotel.</p>
        )}

        {/* Rating Submission Form */}
        <div className="rating-container">
          <h2 className="rating-title">Rate This Hotel</h2>
          <form onSubmit={handleRatingSubmit} className="rating-form">
            <div className="form-group">
              <label>Your Name:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                required
                className="rating-input"
              />
            </div>
            <div className="form-group">
              <label>Rating (1-5 stars):</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
                className="rating-select"
              >
                <option value={0}>Select rating</option>
                <option value={1}>⭐ 1</option>
                <option value={2}>⭐⭐ 2</option>
                <option value={3}>⭐⭐⭐ 3</option>
                <option value={4}>⭐⭐⭐⭐ 4</option>
                <option value={5}>⭐⭐⭐⭐⭐ 5</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comments:</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience..."
                rows="4"
                className="rating-textarea"
              />
            </div>
            <button type="submit" className="submit-rating-button">
              Submit Rating
            </button>
          </form>
        </div>

        <button onClick={() => navigate("/hotels")} className="back-button">
          ⬅️ Back to Hotels
        </button>

        {/* Display Ratings at the Bottom */}
        {menuItems.length > 0 && (
          <div className="ratings-display">
            <h3 className="ratings-title">User Ratings</h3>
            {ratings.length > 0 ? (
              <div className="menu-items">
                {ratings.map((ratingItem) => (
                  <div
                    key={ratingItem.id || `${ratingItem.name}-${ratingItem.rating}-${Math.random()}`}
                    className="menu-item"
                  >
                    <h2 className="item-name">{ratingItem.name}</h2>
                    <p className="item-description">{renderStars(ratingItem.rating)}</p>
                    <p className="item-price">{ratingItem.description || "No comments provided."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-ratings">No ratings yet for this hotel.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;