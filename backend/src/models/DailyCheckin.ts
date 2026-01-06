import mongoose, { Schema, Document } from "mongoose";

export interface IDailyCheckin extends Document {
  userId: mongoose.Types.ObjectId;
  answers: Record<string, number>;
  dailyScore: number;
  combinedScore: number;
  label: string;
  moodScore?: number;
  moodType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const dailyCheckinSchema = new Schema<IDailyCheckin>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    answers: {
      type: Schema.Types.Mixed,
      required: true,
    },
    dailyScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    combinedScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    moodScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    moodType: {
      type: String,
      trim: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

dailyCheckinSchema.index({ userId: 1, createdAt: -1 });

export const DailyCheckin = mongoose.model<IDailyCheckin>(
  "DailyCheckin",
  dailyCheckinSchema
);

