import pool from "../config/db.js";
import { createMenu ,delteMenuById} from "../models/menu.model.js";

export const addMenu = async (req, res) => {
  const { hotel_id, name, description, price } = req.body;
  const adminId = req.admin.id; // Retrieved from authentication middleware

  if (!hotel_id || !name || !price) {
    return res.status(400).json({ message: "Hotel ID, name, and price are required" });
  }

  try {
    // Check if the hotel belongs to the admin
    const [hotels] = await pool.query("SELECT * FROM hotels WHERE id = ? AND admin_id = ?", [hotel_id, adminId]);

    if (hotels.length === 0) {
      return res.status(403).json({ message: "You are not authorized to add a menu to this hotel" });
    }

    // Add menu item to database
    const menuId = await createMenu(hotel_id, name, description, price);

    res.status(201).json({
      message: "Menu item added successfully",
      menuId: menuId
    });

  } catch (error) {
    res.status(500).json({ message: "Error adding menu item", error: error.message });
  }
};

export const deleteMenu = async(req,res) => {
  const {id} = req.params; // get menu id form url 
  const adminId = req.admin.id; // get admin id from authentication 
  
  try{
    const result = await delteMenuById(id,adminId);
    if(!result){
      return res.status(403).json({message : "menu does not exist "});
    }
    res.status(200).json({message : "menu delete successfully"});
  }
  catch(error){
    res.status(500).json({message : "error deleting menu ",error : error.message});
  }
}


