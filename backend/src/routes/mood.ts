import express from "express";
import { auth } from "../middleware/auth";
import { getMoodHistory, getLatestRecommendations } from "../controllers/moodController";

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Fetch latest recommendations
router.get("/recommendations/latest", getLatestRecommendations);
// Fetch mood history
router.get("/", getMoodHistory);

export default router;