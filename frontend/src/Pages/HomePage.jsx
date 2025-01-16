// src/HomePage.jsx
import React from "react";
import {Link} from "react-router-dom"
import "./HomePage.css"; // Importing the CSS file for styling

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <h2>Travel Planner</h2>
        </div>
        <div className="navbar-links">
          <a href="#home">Home</a>
          <a href="#destinations">Destinations</a>
          <a href="#plans">Plans</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>
      
      {/* Hero Section */}
      <header className="hero-section">
        <h1>Plan Your Next Adventure</h1>
        <p>Explore the world's best travel destinations with ease</p>
        <Link to="/plan"><button className="cta-button">Start Planning</button></Link>
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
