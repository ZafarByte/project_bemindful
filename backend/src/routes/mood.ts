import express from "express";
import { auth } from "../middleware/auth";
import { createMood, getMoodHistory, getLatestRecommendations } from "../controllers/moodController";

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Track a new mood entry
router.post("/", createMood);
// Fetch latest recommendations
router.get("/recommendations/latest", getLatestRecommendations);
// Fetch mood history
router.get("/", getMoodHistory);

export default router;