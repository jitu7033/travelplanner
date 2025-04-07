import pool from "../config/db.js";


// find user by username

export const findUserByusername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM signUp WHERE username = ?', [username]);
  return rows.length > 0 ? rows[0] : null;
}

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM signUp WHERE email = ?', [email]);
  return rows.length > 0 ? rows[0] : null;
}

// get all user 
export const getUsers = async() => {
  const [rows] = await pool.query('SELECT * FROM signUp');
  return rows;
}

// Add new User
export const createUser = async (username,name,email,password) => {
  const [result] = await pool.query('INSERT INTO signUp(username,name,email,password) Values(?,?,?,?)',[username,name,email,password]);
  return result.insertId;
}

