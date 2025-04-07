import pool from "../config/db.js";

export const createMenu = async (hotel_id, name, description, price) => {
  const [result] = await pool.query(
    "INSERT INTO menu (hotel_id, name, description, price) VALUES (?, ?, ?, ?)",
    [hotel_id, name, description, price]
  );
  return result.insertId; // Return the new menu ID
};

// function to delete the menue from this hotel 

export const delteMenuById = async(menuId,adminId) =>{
  const [menu] = await pool.query(
    `SELECT  menu.id from menu 
    JOIN hotels ON menu.hotel_id = hotels.id 
    WHERE menu.id  = ? AND hotels.admin_id = ?`,
    [menuId,adminId]
  );

  if(menu.length == 0){
    return null ; // menue does not belong to the admin 
  }

  await pool.query("DELETE FROM menu where id = ?",[menuId]);
  return true;
}
