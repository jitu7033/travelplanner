import { handleTrip } from "../controllers/tripPlanner.controller.js";
import express from "express";
const router = express.Router();

router.post("/plan", handleTrip);

export default router;
