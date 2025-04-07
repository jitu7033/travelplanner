import pool from "../config/db.js";


export const createRating = async (hotelId, name, rating, description) => {
  const [result] = await pool.query(
    "INSERT INTO rating (hotel_id, name, rating, description) VALUES (?, ?, ?, ?)",
    [hotelId, name, rating, description]
  );
  return result.insertId; // Returns the newly created rating ID
};

export const getRating = async(hotelId) => {
  const [row] = await pool.query("SELECT * FROM rating where hotel_id = ?",[hotelId]);
  return row;
}