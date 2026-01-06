import mongoose, { Document, Schema } from "mongoose";

export interface IMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    technique?: string;
    goal?: string;
    progress?: any[];
    analysis?: {
      emotionalState: string;
      themes: string[];
      riskLevel: number;
      recommendedApproach: string;
      progressIndicators: string[];
    };
  };
}

export interface IChatSession extends Document {
  userId: mongoose.Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    summary?: string;
    goals?: string[];
    activeTechnique?: string;
  };
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, required: true, enum: ["user", "assistant", "system"] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed },
});

const ChatSessionSchema = new Schema<IChatSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messages: [MessageSchema],
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const ChatSession = mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);
