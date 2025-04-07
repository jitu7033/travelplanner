import { getAllHotels, getHotelMenu } from "../models/hotel.model.js";
import {
  createHotel,
  getHotelByIdAndAdmin,
  getHotelsByAdmin,
  updateHotel,
  deleteHotel
}from "../models/hotel.model.js"


// get all hotel 

export const getHotels = async(req,res) => {
  try{
    const hotel = await getAllHotels();
    res.status(200).json(hotel);
  }
  catch(error){
    res.status(500).json({error : "error fetching hotel", message : error.meassage});
  }
};

// get menu for a specific hotel 
export const getMenuByHotel = async(req,res) => {
  try{
    const {id} = req.params;
    // console.log(id);
    const menu = await getHotelMenu(id);
    // if(menu.length == 0)return res.status(401).json({message : "menu not found"});
    res.status(200).json(menu);
  }
  catch(error){
    res.status(500).json({error : "error finding the menue",message : error.meassage});
    console.log(error.message);
  }
}


// add hotel 

export const addHotel = async(req,res) => {
  const {name,location,rating} = req.body;
  const adminId = req.admin.id;
  console.log(adminId);

  let image_url = null;
  if(req.file) {
    image_url = `/uploads/${req.file.filename}`;
  }
  else {
    return res.status(400).json({ message: "Image is required" });
  }
  try{
    const hotelId = await createHotel(name,image_url,location,rating,adminId);
    res.status(201).json({message : "Hotel created SuccessFully"});
  }
  catch(error){
    res.status(500).json({ message: "Error creating hotel", error: error.message });
  }
}


// get all hotel for a specific admin  
export const getAdminHotels = async(req,res) =>{
  const adminId = req.admin.id;
  // const adminId = 1;
  // console.log(adminId);
  try{
    const hotels = await getHotelsByAdmin(adminId);
    res.status(200).json(hotels);
  }
  catch(error){
    res.status(500).json({ message: "Error fetching hotels", error: error.message });
  }
}


// update a hotel (admin only);

export const editHotel = async(req,res) => {
  const {id} = req.params;
  const { name, image_url, location, rating } = req.body;
  const adminId = req.admin.id;

  try {
    const hotel = await getHotelByIdAndAdmin(id, adminId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found or unauthorized" });

    await updateHotel(id, name, image_url, location, rating, adminId);
    res.status(200).json({ message: "Hotel updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating hotel", error: error.message });
  }
};


export const removeHotel = async (req, res) => {
  const { id } = req.params;
  const adminId = req.admin.id;

  try {
    const hotel = await getHotelByIdAndAdmin(id, adminId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found or unauthorized" });

    await deleteHotel(id, adminId);
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting hotel", error: error.message });
  }
};

