
import { Request, Response, NextFunction } from "express";
import { Mood } from "../models/Mood";
import { BaselineSurvey } from "../models/BaselineSurvey";
import { logger } from "../utils/logger";
import {
  getMoodType,
  predictMoodFromModel,
} from "../utils/moodModelClient";
import { getRecommendations } from "../utils/recommendations";

// Create a new mood entry
export const createMood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { note, context, activities, features } = req.body;
    const userId = req.user?._id; // From auth middleware

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Enforce AI model prediction
    if (!Array.isArray(features) || features.length === 0) {
      return res
        .status(400)
        .json({ message: "Features are required for AI mood prediction" });
    }

    let moodScore: number;
    let detectedMoodType: string;
    let predictionSource: "model" | "manual" = "model";

    try {
      const numericFeatures = features.map((value: any) => Number(value));
      if (numericFeatures.some((value) => Number.isNaN(value))) {
        throw new Error("All features must be numeric values");
      }
      const prediction = await predictMoodFromModel(numericFeatures);
      logger.info("Mood model prediction used", {
        userId,
        features: numericFeatures,
        prediction,
      });
      moodScore = prediction.moodScore;
      detectedMoodType = prediction.moodType;
      predictionSource = prediction.source;
    } catch (modelError) {
      logger.error("Mood model prediction failed", { modelError });
      return res.status(500).json({
        message: "AI Mood prediction failed",
        error: modelError instanceof Error ? modelError.message : "Unknown error",
      });
    }

    if (!detectedMoodType) {
      detectedMoodType = getMoodType(moodScore);
    }

    const mood = new Mood({
      userId,
      score: moodScore,
      moodType: detectedMoodType,
      predictionSource,
      note,
      context,
      activities,
      timestamp: new Date(),
    });

    await mood.save();
    logger.info(`Mood entry created for user ${userId}`);

    // Generate recommendations
    let recommendations: string[] = [];
    let needsProfessionalHelp = false;

    try {
      const baseline = await BaselineSurvey.findOne({ userId });
      if (baseline) {
        const result = getRecommendations(
          moodScore,
          baseline.answers as Record<string, number>
        );
        recommendations = result.tips;
        needsProfessionalHelp = result.needsProfessionalHelp;
      }
    } catch (recError) {
      logger.error("Failed to generate recommendations", { recError });
    }

    res.status(201).json({
      success: true,
      data: mood,
      recommendations,
      needsProfessionalHelp,
    });
  } catch (error) {
    next(error);
  }
};

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