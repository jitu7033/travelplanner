
import { addRating,getAllRating } from "../controllers/rating.controller.js";

import express from "express";
const router = express.Router();

router.post('/:id/addRating', addRating); 
router.get('/:id/getRating',getAllRating);

export default router;