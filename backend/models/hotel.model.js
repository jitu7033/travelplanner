import pool from "../config/db.js";

export const getAllHotels = async() => {
  const [rows] = await pool.query('SELECT * FROM hotels');
  return rows;
}


export const getHotelMenu = async(hotelId) => {
  const [row] = await pool.query("SELECT * FROM menu where hotel_id = ?",[hotelId]);
  return row;
}

// create hotel 
export const createHotel = async (name, image_url, location, rating, adminId) => {
  const query = `
    INSERT INTO hotels (name, image_url, location, rating, admin_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [name, image_url, location, rating, adminId];
  console.log("Inserting hotel with values:", values);
  const [result] = await pool.query(query, values);
  return result.insertId;
};

// add new menue item from specific hotel 

export const createMenu = async (hotelId,name,description,price) => {
  const [result] = await pool.query(
    "INSERT INTO menu (hotel_id, name,description,price) VALUES (?,?,?,?)",[hotelId,name,description,price]
  );
  return result.insertId; // return new menu id;
}

// get all hotel by admin id 

export const getHotelsByAdmin = async (adminId) => {
  const [hotels] = await pool.query("SELECT * FROM hotels WHERE admin_id = ?", [adminId]);
  return hotels;
};


// Get a specific hotel by ID and admin ID (for update/delete check)
export const getHotelByIdAndAdmin = async (hotelId, adminId) => {
  const [hotel] = await pool.query("SELECT * FROM hotels WHERE id = ? AND admin_id = ?", [hotelId, adminId]);
  return hotel[0];
};
// export const update hotel

export const updateHotel = async(hotelId,name,image_url,location,rating,adminId) => {
  await pool.query(
   "UPDATE hotels SET name = ?, image_url = ?, location = ?, rating = ? WHERE id = ? AND admin_id = ?",
    [name, image_url, location, rating, hotelId, adminId]
  );
}

// delte hotel admin only 

export const deleteHotel = async(hotelId, adminId) => {
  await pool.query("DELETE FROM hotels WHERE id = ? AND admin_id = ?", [hotelId, adminId]);
}
