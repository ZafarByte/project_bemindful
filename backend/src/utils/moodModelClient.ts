import { logger } from "./logger";

export type MoodPredictionSource = "model" | "manual";

export interface MoodPredictionResult {
  moodScore: number;
  moodType: string;
  source: MoodPredictionSource;
}

export const getMoodType = (score: number): string => {
  if (score <= 25) return "High Distress";
  if (score <= 45) return "Moderate Stress";
  if (score <= 65) return "Neutral";
  if (score <= 85) return "Positive";
  return "Flourishing";
};

/**
 * Calls the Python mood model service to infer mood score/type.
 * Expects the FastAPI server (api.py) to be running and accessible.
 */
export const predictMoodFromModel = async (
  features: number[]
): Promise<MoodPredictionResult> => {
  if (!Array.isArray(features) || features.length === 0) {
    throw new Error("features must be a non-empty numeric array");
  }

  const url = process.env.MOOD_MODEL_URL || "http://localhost:8000/predict";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: features }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Mood model request failed (${response.status}): ${text}`);
    }

    const payload = await response.json();
    const moodScoreRaw =
      typeof payload.mood_score === "number"
        ? payload.mood_score
        : payload.moodScore;

    if (typeof moodScoreRaw !== "number" || Number.isNaN(moodScoreRaw)) {
      throw new Error("Mood model did not return a numeric score");
    }

    const clampedScore = Math.max(0, Math.min(100, moodScoreRaw));
    const moodType =
      payload.mood_type || payload.moodType || getMoodType(clampedScore);

    // Log full model response in backend console
    logger.info("Mood model response", {
      url,
      payload,
      moodScoreRaw,
      clampedScore,
      moodType,
    });

    return {
      moodScore: clampedScore,
      moodType,
      source: "model",
    };
  } catch (error) {
    logger.error("Failed to call mood model service", { error });
    throw error;
  }
};

