import express from "express";
import { addMenu, deleteMenu } from "../controllers/menu.controller.js";
import authenticateAdmin from "../middleware/authMiddleware.js"; // Middleware for admin authentication

const router = express.Router();

// Route to add a menu item (only the admin who owns the hotel can add)
router.post("/add", authenticateAdmin, addMenu);

// delete the menu form the hoetels 

router.delete("/delete/:id",authenticateAdmin,deleteMenu);

export default router;
