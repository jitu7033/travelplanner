
// controllers/user.controller.js
import { getUsers, createUser ,findUserByusername,findUserByEmail} from "../models/user.model.js";


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const loginUser = async(req,res) => {
  try{
    const {email,password} = req.body;
    if(!email || !password){
      return res.status(400).json({error : "All fields are required"});
    }
    const user = await findUserByEmail(email);
    if(!user){
      return res.status(404).json({error : "User not found"});
    }
    if(user.password !== password){
      return res.status(401).json({error : "Invalid credentials"});
    }
    res.status(200).json({message : "User logged in successfully",userId : user.id});
  }catch(error){
    console.error("Error logging in user",error);
    res.status(500).json({error : "Internal server error"});
  }
}

// Add new user
export const addUser = async (req, res) => {
  try {
    const { username, name, email, password, confirmPassword } = req.body;

    if (!username || !name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // check if user already exists
    const existingUser = await findUserByusername(username);
    const existingUserEmail = await findUserByEmail(email);
    // console.log(existingUser); // check status code is generate or not 
    if(existingUser){
      return res.status(409).json({ error: "Username already exists" });
    }
    if(existingUserEmail){
      return res.status(410).json({ error: "Email already exists" });
    }
    const id = await createUser(username, name, email, password);
    res.status(201).json({ message: "User added successfully", userId: id });
  } catch (error) {
    console.error("Error adding user", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
