import { Request, Response, NextFunction } from "express";
import { BaselineSurvey } from "../models/BaselineSurvey";
import { DailyCheckin } from "../models/DailyCheckin";
import { Mood } from "../models/Mood";
import { logger } from "../utils/logger";
import { predictMoodFromModel } from "../utils/moodModelClient";
import { getRecommendations } from "../utils/recommendations";

const baselineOrder = [
  "sleepDuration",
  "sleepQuality",
  "sleepRegularity",
  "physicalActivity",
  "physicalHealth",
  "workStress",
  "commuteTime",
  "screenTime",
  "dietQuality",
  "substanceUse",
  "socialInteraction",
  "socialSupport",
  "lifeSatisfaction",
  "overwhelmed",
  "healthCondition",
] as const;

const dailyOrder = [
  "stress",
  "anxiety",
  "mood",
  "energy",
  "motivation",
  "emotional_control",
] as const;

export const submitBaseline = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { answers } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ message: "Answers are required" });
    }

    // Construct features for ML model
    // For baseline, we don't have daily answers yet, so we use neutral values (2)
    // assuming the scale is 0-4.
    const features: number[] = [
      ...baselineOrder.map((key) => answers[key] ?? 0),
      ...dailyOrder.map(() => 2), // Neutral daily values
    ];

    let baselineScore = 0.5; // Default neutral
    try {
      const prediction = await predictMoodFromModel(features);
      // Convert 0-100 to 0-1
      baselineScore = prediction.moodScore / 100;

      // Create Mood record from baseline
      await Mood.create({
        userId,
        score: prediction.moodScore,
        moodType: prediction.moodType,
        predictionSource: "model",
        note: "Baseline Assessment",
        timestamp: new Date(),
      });

      logger.info("AI mood model used for baseline", {
        userId,
        features,
        moodScore: prediction.moodScore,
      });
    } catch (error) {
      logger.error("AI mood model failed for baseline", { error });
    }

    const record = await BaselineSurvey.findOneAndUpdate(
      { userId },
      {
        userId,
        answers,
        score: baselineScore,
        completedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    logger.info("Baseline stored", { userId, baselineScore });

    res.status(201).json({ success: true, baselineScore: record.score });
  } catch (error) {
    next(error);
  }
};

export const submitDaily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { answers } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const baseline = await BaselineSurvey.findOne({ userId });
    if (!baseline) {
      return res
        .status(400)
        .json({ message: "Baseline not found. Please complete baseline first." });
    }

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ message: "Answers are required" });
    }

    const allBaselineAnswers = baseline.answers as Record<string, number>;

    const features: number[] = [
      ...baselineOrder.map((key) => allBaselineAnswers[key] ?? 0),
      ...dailyOrder.map((key) => answers[key] ?? 0),
    ];

    let moodScore = 50; // Default neutral
    let moodType = "Neutral";
    let normalizedScore = 0.5;

    try {
      const prediction = await predictMoodFromModel(features);
      moodScore = prediction.moodScore;
      moodType = prediction.moodType;
      normalizedScore = moodScore / 100;
      
      // Create Mood record from daily check-in
      await Mood.create({
        userId,
        score: moodScore,
        moodType: moodType,
        predictionSource: "model",
        note: "Daily Check-in",
        timestamp: new Date(),
      });

      logger.info("AI mood model used for stress daily check-in", {
        userId,
        features,
        moodScore,
        moodType,
      });
    } catch (error) {
      logger.error("AI mood model failed for stress daily check-in", { error });
    }

    // Calculate daily score manually (simple average of normalized values)
    // Assuming 0-4 scale for all daily items
    // Higher is better for: mood, energy, motivation, emotional_control
    // Lower is better for: stress, anxiety
    const dailyValues = [
      1 - (answers["stress"] ?? 0) / 4,
      1 - (answers["anxiety"] ?? 0) / 4,
      (answers["mood"] ?? 0) / 4,
      (answers["energy"] ?? 0) / 4,
      (answers["motivation"] ?? 0) / 4,
      (answers["emotional_control"] ?? 0) / 4,
    ];
    
    const calculatedDailyScore = dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length;

    // Use calculated score for daily, and ML score for combined
    const dailyScore = calculatedDailyScore;
    const combinedScore = normalizedScore;
    const label = moodType;

    const entry = await DailyCheckin.create({
      userId,
      answers,
      dailyScore,
      combinedScore,
      label,
      moodScore,
      moodType,
    });

    logger.info("Daily check-in stored", {
      userId,
      combinedScore,
      label,
      moodScore: entry.moodScore,
      moodType: entry.moodType,
    });

    const result = getRecommendations(moodScore, allBaselineAnswers);

    res.status(201).json({
      success: true,
      dailyScore: entry.dailyScore,
      combinedScore: entry.combinedScore,
      label: entry.label,
      baselineScore: baseline.score,
      moodScore: entry.moodScore ?? null,
      moodType: entry.moodType ?? null,
      recommendations: result.tips,
      needsProfessionalHelp: result.needsProfessionalHelp,
    });
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const baseline = await BaselineSurvey.findOne({ userId });
    const latestDaily = await DailyCheckin.findOne({ userId }).sort({
      createdAt: -1,
    });

    // Calculate streak
    const allCheckins = await DailyCheckin.find({ userId })
      .sort({ createdAt: -1 })
      .select("createdAt");

    let streak = 0;
    if (allCheckins.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Get unique dates (YYYY-MM-DD)
      const uniqueDates = Array.from(new Set(allCheckins.map(c => {
        const d = new Date(c.createdAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      }))).sort((a, b) => b - a);

      if (uniqueDates.length > 0) {
        const lastDate = uniqueDates[0];
        // If last check-in was today or yesterday, the streak is alive
        if (lastDate === today.getTime() || lastDate === yesterday.getTime()) {
           streak = 1;
           let currentDate = lastDate;
           for (let i = 1; i < uniqueDates.length; i++) {
             const prevDate = uniqueDates[i];
             const expectedPrev = new Date(currentDate);
             expectedPrev.setDate(expectedPrev.getDate() - 1);
             
             if (prevDate === expectedPrev.getTime()) {
               streak++;
               currentDate = prevDate;
             } else {
               break;
             }
           }
        }
      }
    }

    res.json({
      hasBaseline: !!baseline,
      baselineScore: baseline?.score ?? null,
      baselineCompletedAt: baseline?.completedAt ?? null,
      baselineAnswers: baseline?.answers ?? null,
      streak,
      latestDaily: latestDaily
        ? {
            dailyScore: latestDaily.dailyScore,
            combinedScore: latestDaily.combinedScore,
            label: latestDaily.label,
            moodScore: latestDaily.moodScore ?? null,
            moodType: latestDaily.moodType ?? null,
            createdAt: latestDaily.createdAt,
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

// Get daily check-in history (mood scores from stress surveys)
export const getDailyCheckinHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 30, 365);

    const history = await DailyCheckin.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("combinedScore dailyScore createdAt")
      .lean();

    res.json({
      success: true,
      data: history.map((entry) => ({
        timestamp: entry.createdAt,
        score: Math.round(entry.combinedScore * 100), // Convert 0-1 to 0-100
        dailyScore: Math.round(entry.dailyScore * 100),
      })),
    });
  } catch (error) {
    next(error);
  }
};

