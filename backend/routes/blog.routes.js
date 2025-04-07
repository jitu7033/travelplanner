import express from 'express';
import multer from 'multer';
import path from 'path';
import { addBlogController, getBlogsController } from '../controllers/blog.controller.js';

const router = express.Router();

// Multer Setup for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Store images in public/uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});


const upload = multer({ storage }).array('images', 5); // Allow up to 5 images

// Routes
router.post('/add-blog', upload, addBlogController); // Create a new blog with images
router.get('/get', getBlogsController); // Get all blogs with their images

export default router;