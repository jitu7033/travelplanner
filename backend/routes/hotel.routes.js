
// import express from "express";
// import {getHotels , getMenuByHotel ,addHotel,getAdminHotels,editHotel,removeHotel} from "../controllers/hotel.controller.js";
// import multer from "multer";
// import path from "path";
// import authenticateAdmin from "../middleware/authMiddleware.js";


// const router = express.Router();

// // multer setup for image upload

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads/'); // Store images in public/uploads/
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });


// const upload = multer({ storage }).array('images', 5); // Allow up to 5 images




// router.get("/",getHotels);
// router.get("/:id/menu",getMenuByHotel);

// // add a hotel admin only 
// router.post("/add",authenticateAdmin,upload,addHotel);

// // get all hotel from logged in admin 
// router.get("/get",authenticateAdmin,getAdminHotels);

// // update hotel 
// router.put("/edit/:id",authenticateAdmin,editHotel);

// //delete router 
// router.delete("/delete/:id",authenticateAdmin,removeHotel);

// // router.get('/:hotelId', getHotelRatings); // Get ratings for a hotel

// export default router;


import express from "express";
import { getHotels, getMenuByHotel, addHotel, getAdminHotels, editHotel, removeHotel } from "../controllers/hotel.controller.js";
import multer from "multer";
import path from "path";
import authenticateAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Store images in public/uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage }).single('image_url'); // Handle single file upload with key 'image_url'

// Routes
router.get("/", getHotels);
router.get("/:id/menu", getMenuByHotel);

// Add a hotel admin only
router.post("/add", authenticateAdmin, upload, addHotel);

// Get all hotels from logged-in admin
router.get("/get", authenticateAdmin, getAdminHotels);

// Update hotel
router.put("/edit/:id", authenticateAdmin, editHotel);

// Delete hotel
router.delete("/delete/:id", authenticateAdmin, removeHotel);

// router.get('/:hotelId', getHotelRatings); // Get ratings for a hotel

export default router;