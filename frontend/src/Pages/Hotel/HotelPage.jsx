


import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./styles/HotelPage.css";
import hotelImage from "../../assets/istockphoto-636484522-612x612.jpg";

const HotelPage = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        localStorage.removeItem('hotels'); // Force fresh fetch (temporary)
        const response = await axios.get("http://localhost:3000/api/hotels/");
        // console.log("API Response:", response.data.length, response.data);
        const fetchedHotels = Array.isArray(response.data) ? response.data : response.data.hotels || [];
        setHotels(fetchedHotels);
        // console.log("Hotels State:", hotels.length, hotels); // Log after setHotels
        setFilteredHotels(fetchedHotels);
        // console.log("Filtered Hotels State:", filteredHotels.length, filteredHotels); // Log after setFilteredHotels
        localStorage.setItem('hotels', JSON.stringify(fetchedHotels));
      } catch (error) {
        console.log("Error fetching hotels: ", error);
      }
    };
    fetchHotels();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = hotels.filter((hotel) =>
      hotel.location.toLowerCase().includes(query) || 
      hotel.name.toLowerCase().includes(query)
    );
    // console.log("Filtered Hotels:", filtered.length, filtered);
    setFilteredHotels(filtered);
  };

  const handleViewMenu = (hotelId) => {
    navigate(`/menu/${hotelId}`);
  };

  // console.log("Hotels to Render:", filteredHotels.length, filteredHotels);

  return (
    <div className="hotel-page-container">
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

      <div className="hotel-container">
        <h1 className="hotel-title">🏨 Our Hotels</h1>
        
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search hotels by location..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="hotel-grid">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel, index) => (
              <div key={hotel.id || `hotel-${index}`} className="hotel-card">
                <img src={hotelImage} alt={hotel.name} className="hotel-image" />
                <h2 className="hotel-name">{hotel.name}</h2>
                <p className="hotel-location">📍 {hotel.location}</p>
                <p className="hotel-rating">⭐ {hotel.rating}/5</p>
                <button
                  className="menu-button"
                  onClick={() => handleViewMenu(hotel.id)}
                >
                  View Menu 🍽️
                </button>
              </div>
            ))
          ) : (
            <p className="no-hotels">No hotels found for this location.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelPage;