// src/SignInPage.jsx
import React from "react";
import "./LoginPage.css";
import { useState } from "react";

const LoginAsAdmin = () => {
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
      const response = await fetch('http://localhost:3000/api/register-admin/login-admin',{
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
        console.log(data.userId);
        setId(data.userId);
        alert('User logged in successfully');

        // seve credential in local storage to use for show data in logged in page 
        localStorage.setItem('adminId',JSON.stringify(data.userId));
        
    
        // Redirect to home page
    
        window.location.href = '/admin';
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

          <p className="signup-link">
          Login As User ? <a href="/login">Login As User</a>
        </p>
        </form>

    
      </div>

     
    </div>
  );
};

export default LoginAsAdmin;