
import { Request, Response, NextFunction } from "express";
import { Activity, IActivity } from "../models/Activity";
import { logger } from "../utils/logger";

// Log a new activity
export const logActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, name, description, duration, difficulty, feedback } =
      req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const activity = new Activity({
      userId,
      type,
      name,
      description,
      duration,
      difficulty,
      feedback,
      timestamp: new Date(),
    });

    await activity.save();
    logger.info(`Activity logged for user ${userId}`);


    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

// Get activities with optional filtering
export const getActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { type, search, limit = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const query: any = { userId };

    if (type) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const activities = await Activity.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    const total = await Activity.countDocuments(query);

    res.status(200).json({
      success: true,
      data: activities,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// Update an activity
export const updateActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const activity = await Activity.findOne({ _id: id, userId });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (description !== undefined) activity.description = description;
    
    await activity.save();

    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};
