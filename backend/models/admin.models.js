import pool from "../config/db.js";


// register new admin

export const createAdmin = async(name,email,password) => {
  const [result] = await pool.query(
    "INSERT INTO admins (name,email,password) VALUES (?,?,?)",[name,email,password]
  );
  return result.insertId;
}

// find admin by model 

export const findAdminByEmail = async(email) => {
  const [row] = await pool.query(
    'SELECT * FROM admins WHERE email = ?',[email]
  )
  return row[0];
}

// find the  admin by id 
export const findAdminById = async(id) => {
  const [row] = await pool.query(
    'SELECT * FROM admins WHERE id = ?',[id]
  )
  return row[0];
}