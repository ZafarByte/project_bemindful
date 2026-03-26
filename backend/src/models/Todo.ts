import mongoose, { Document, Schema } from "mongoose";

export interface ITodo extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  isCompleted: boolean;
  source?: string; // e.g., "recommendation", "manual"
  createdAt: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: "manual",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Todo = mongoose.model<ITodo>("Todo", todoSchema);
