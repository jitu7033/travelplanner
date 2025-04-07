// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Keep your Navbar styles consistent

const Navbar = () => {
  return (
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
  );
};

export default Navbar;
