import express from "express";

import { loginAdmin,registerAdmin } from "../controllers/admin.controller.js";


const router = express.Router();

// route to add a hotel 
// router.post("/add-hotel",addHotel);

// route to add menue

router.post("/add-admin",registerAdmin);
router.post("/login-admin",loginAdmin);

export default router;

