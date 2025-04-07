// src/SignInPage.jsx
import React from "react";
import "./LoginPage.css";
import { useState } from "react";

const SignInPage = () => {
  const [id,setId] = useState('');
  const [formData,setFormData] = useState({
    email : '',
    password :''
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:3000/api/signUp/login',{
        method : 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({
          email : formData.email,
          password : formData.password
        })
      });
      const data = await response.json();
      if(response.status === 404){
        alert('User not found');
        return;
      }
      if(!response.ok){
        alert('Invalid credentials');
        return;
      }
      if(response.ok){
        console.log(data.id);
        alert('User logged in successfully');

        // seve credential in local storage to use for show data in logged in page 

        localStorage.setItem('user',JSON.stringify(formData));
        
    
        // Redirect to home page
        
        window.location.href = '/';
      }
    }catch(e){
      console.log(e);

    } 
  }

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2>Sign In</h2>
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signin-button">Sign In</button>
        </form>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
        <p className="signup-link">
          Login As Admin ? <a href="/loginAsAdmin">Admin Login</a>
        </p>
      </div>
      
    </div>
  );
};

export default SignInPage;