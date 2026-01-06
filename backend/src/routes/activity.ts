
import express from "express";
import { auth } from "../middleware/auth";
import { logActivity, getActivities, updateActivity } from "../controllers/activityController";

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Log a new activity
router.post("/", logActivity);

// Get activities
router.get("/", getActivities);

// Update an activity
router.put("/:id", updateActivity);

export default router;
