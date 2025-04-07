import pool from "../config/db.js";


const authenticateAdmin = async (req, res, next) => {
  console.log("headers recieved ",req.headers);
  const { adminid } = req.headers; // Admin ID from the frontend

  // const adminId = 1;

  console.log(adminid);

  if (!adminid) {
    return res.status(401).json({ message: "Admin ID is required" });
  }

  try {
    const [admins] = await pool.query("SELECT * FROM admins WHERE id = ?", [adminid]);
    if (admins.length === 0) {
      return res.status(401).json({ message: "Invalid Admin ID" });
    }

    req.admin = admins[0]; // Attach admin info to the request
    next();
  } catch (error) {
    res.status(500).json({ message: "Error during authentication", error: error.message });
  }
};

export default authenticateAdmin;
