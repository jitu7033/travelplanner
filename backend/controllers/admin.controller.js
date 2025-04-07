// import { createHotel, createMenu } from "../models/hotel.model.js";
import { createAdmin,findAdminByEmail,findAdminById } from "../models/admin.models.js";
import express from "express";
// admin regestration 


export const registerAdmin = async(req,res) => {
  try{
    const {name,email,password} = req.body;

    console.log(name);
    console.log(email);
    console.log(password);
    if(!name || !email || !password){
      return res.status(400).json({error : "All fields are required"});
    }
    const existingAdmin = await findAdminByEmail(email);
    if(existingAdmin){
      return res.status(400).json({error : "Admin already exist"});
    }
    const adminId = await createAdmin(name,email,password);
    res.status(201).json({message : "Admin Registered Successfully",adminId});
  }
  catch(error){
    res.status(500).json({error : error.message});
  }
}

// login admin

export const loginAdmin = async(req,res) => {
  try{
    const {email,password} = req.body;
    if(!email || !password){
      return res.status(401).json({error : "invalid Credential"});
    }
    const user = await findAdminByEmail(email);
    if(!user){
      return res.status(404).json({error : "user doesnot exist"});
    }
    if(user.password !== password){
        return res.status(401).json({error : "Invalid credentials"});
    }
    res.status(200).json({message : "User logged in successfully",userId : user.id});
  }
  catch(error){
    res.status(500).json({error : error.message});
  }
}

// add new hotel 

export const addHotel = async(req,res) => {
  try{
    const {name,img_url,location,rating} = req.body;
    if(!name || !img_url || !location || !rating){
      return res.status(400).json({error : "All Filed are required"});
    }
    const hotelId = await createHotel(name,img_url,location,rating);
    res.status(200).json({message : "hotel added succesfully",hotelId});

  }
  catch(error){
    res.status(500).json({error : "some internal error adding a hotel",error : error.message});
  }
} 

// add menue 

export const addMenu = async (req, res) => {
  try {
    const {id} = req.params;
    const { name, description, price } = req.body;
    if (!name || !description || price == null) {
      return res.status(400).json({ error: "All fields are required" });
    }
    await createMenu(id, name, description, price);
    res.status(201).json({ message: "Menu item added successfully" });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchHotels = async (req, res) => {
  try {
    const hotels = await getAllHotels();
    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
