// src/server.ts
import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { serve } from "inngest/express";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import authRouter from "./routes/auth";
import chatRouter from "./routes/chat";
import moodRouter from "./routes/mood";
import activityRouter from "./routes/activity";
import stressRouter from "./routes/stress";
import todoRouter from "./routes/todo";
import { connectDB } from "./utils/db";

import { inngest } from "./inngest/client";
import { functions as inngestFunctions } from "./inngest/functions";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use("/api/auth", authRouter);
// mount Inngest on /api/inngest
app.use("/api/inngest", serve({ client: inngest, functions: inngestFunctions }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from the backend!");
});

app.use("/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/mood", moodRouter);
app.use("/api/activity", activityRouter);
app.use("/api/stress", stressRouter);
app.use("/api/todo", todoRouter);

app.use(errorHandler);
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT ?? 3001;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Inngest endpoint available at http://localhost:${PORT}/api/inngest`);
      console.log("Backend server is ready and listening...");
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};


startServer();
