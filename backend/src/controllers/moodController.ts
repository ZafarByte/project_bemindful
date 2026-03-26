
import { Request, Response, NextFunction } from "express";
import { Mood } from "../models/Mood";
import { BaselineSurvey } from "../models/BaselineSurvey";
import { logger } from "../utils/logger";
import {
  getMoodType,
  predictMoodFromModel,
} from "../utils/moodModelClient";
import { getRecommendations } from "../utils/recommendations";

// Create a new mood entry function removed as per request
// export const createMood = ...

// Get mood history (latest first, optional limit)
export const getMoodHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 30, 90);

    const history = await Mood.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// Get latest recommendations based on most recent mood
export const getLatestRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const latestMood = await Mood.findOne({ userId }).sort({ timestamp: -1 });

    if (!latestMood) {
      return res.json({ recommendations: [], needsProfessionalHelp: false });
    }

    let recommendations: string[] = [];
    let needsProfessionalHelp = false;

    try {
      const baseline = await BaselineSurvey.findOne({ userId });
      // Use baseline answers if available, otherwise empty object to trigger generic logic
      const answers = baseline ? (baseline.answers as Record<string, number>) : {};
      
      const result = getRecommendations(latestMood.score, answers);
      recommendations = result.tips;
      needsProfessionalHelp = result.needsProfessionalHelp;
    } catch (recError) {
      logger.error("Failed to generate latest recommendations", { recError });
    }

    res.json({
      success: true,
      recommendations,
      needsProfessionalHelp,
      moodScore: latestMood.score,
    });
  } catch (error) {
    next(error);
  }
};