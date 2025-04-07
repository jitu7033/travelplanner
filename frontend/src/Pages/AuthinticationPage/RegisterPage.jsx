

// src/RegisterPage.jsx
import React, { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    userName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({
          username:formData.userName,
          name :formData.name,
          email : formData.email,
          password : formData.password,
          confirmPassword: formData.confirmPassword
        })
      });
      const data = await response.json();

      console.log(response.status);
      if(response.status === 409){
        alert('Username already exists');
        return;
      }
      if(response.status === 410){
        alert('Email already exists'); 
        return;
      }
      if (response.ok) {
        alert('User registered successfully');
        // Redirect to login page
        window.location.href = '/login';
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering user', error);
      alert('An error occurred. Please try again later');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>

        <label htmlFor="userName">UserName</label>
        <input
          type="text"
          id="userName"
          name="userName"
          placeholder="Enter your UserName"
          value={formData.userName}
          onChange={handleChange}
          required
        />
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="register-button">Register</button>

        <p>Already have an account? <a href="/login">Log IN</a></p>
      </form>
    </div>
  );
};

export default RegisterPage;
