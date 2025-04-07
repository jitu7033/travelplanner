// src/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // Importing the CSS file for styling

const HomePage = () => {
  const [user, setUser] = useState(null);

  // Retrieve user from local storage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    try{
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    catch(e){
      console.log(e);

    }
    
  }, []);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/"; // Redirect after logout
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <h2>T</h2>
        </div>

        <div className="navbar-links">
        <a href="#AboutUs">About Us</a>
        <a href="#contact">Contact Us</a>
          {user ? (
            <a onClick={handleLogout} className="logout-button">
              Logout
            </a>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <h1>Plan Your Next Adventure</h1>
        <p>Explore the world's best travel destinations with ease</p>
        <Link to="/plan">
          <button className="cta-button">Start Planning</button>
        </Link>
      </header>
      {/* Main Content */}
      <main className="main-content">
        <section className="intro">
          <h2>Why Choose Us?</h2>
          <p>
            We help you plan your perfect vacation with personalized travel
            itineraries, top-rated destinations, and expert travel advice.
          </p>
        </section>

        <section className="features">
          <div className="feature">
            <h3>Custom Itineraries</h3>
            <p>Personalized travel plans tailored to your preferences.</p>
          </div>
          <div className="feature">
            <h3>Expert Advice</h3>
            <p>Get travel tips from seasoned experts and travelers.</p>
          </div>
          <div className="feature">
            <h3>Top Destinations</h3>
            <p>Discover the most beautiful and exciting places to visit.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;




