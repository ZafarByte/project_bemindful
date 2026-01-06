import express from "express";
import { auth } from "../middleware/auth";
import {
  createSession,
  getSessions,
  getHistory,
  sendMessage,
  deleteSession
} from "../controllers/chat";

const router = express.Router();

router.use(auth);

router.post("/sessions", createSession);
router.get("/sessions", getSessions);
router.get("/sessions/:sessionId/history", getHistory);
router.post("/sessions/:sessionId/messages", sendMessage);
router.delete("/sessions/:sessionId", deleteSession);

export default router;
