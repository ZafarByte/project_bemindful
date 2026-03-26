import { Request, Response } from "express";
import { ChatSession } from "../models/ChatSession";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../utils/logger";

const SYSTEM_PROMPT = `You are a compassionate and empathetic AI therapist named "Mindful Companion", specifically tuned for the Indian cultural context.
Your goal is to provide a safe, supportive, and non-judgmental space for users to share their thoughts and feelings.

Key Contextual Guidelines for India:
1. Cultural Sensitivity: Understand Indian family dynamics (joint families, parental expectations), academic pressure (competitive exams), and career stress in the Indian corporate environment. Be sensitive to societal stigma around mental health in India.
2. Language: Communicate in warm, clear English. You can understand Hinglish (Hindi-English mix) if the user uses it, but respond primarily in English unless asked otherwise. Use a respectful and caring tone.
3. Approach: Use active listening, validate emotions, and offer culturally relevant coping strategies (e.g., mindfulness, breathing, referencing yoga/meditation if user is open to it, or practical time management).
4. Boundaries: Do not diagnose mental health conditions or prescribe medication.

CRISIS INTERVENTION (INDIA):
If a user expresses thoughts of self-harm, suicide, or severe distress, immediately provide Indian crisis resources:
- Tele-MANAS (Govt of India): 14416 or 1-800-891-4416
- Vandrevala Foundation: +91 9999 666 555
- iCall (TISS): +91 22 2552 1111
- KIRAN (Govt Helpline): 1800-599-0019
Encourage them to contact these numbers or go to the nearest hospital.

Keep your responses concise, warm, and conversational.`;

export const createSession = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const session = await ChatSession.create({
      userId,
      messages: [],
    });
    res.status(201).json({ sessionId: session._id, session });
  } catch (error) {
    logger.error("Error creating chat session:", error);
    res.status(500).json({ error: "Failed to create chat session" });
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const sessions = await ChatSession.find({ userId }).sort({ updatedAt: -1 });
    res.json({ sessions });
  } catch (error) {
    logger.error("Error fetching chat sessions:", error);
    res.status(500).json({ error: "Failed to fetch chat sessions" });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?._id;

    const session = await ChatSession.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ history: session.messages });
  } catch (error) {
    logger.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;
    const userId = req.user?._id;

    const session = await ChatSession.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Add user message
    session.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");
    // Generate AI response
    // Using gemini-2.5-flash as it is a stable version
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    // Construct history for the model
    // Gemini expects roles 'user' and 'model'
    const history = session.messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // Filter out system messages or invalid roles if any, and ensure alternating roles if required by the API
    // For simplicity, we'll just take the last few messages to provide context
    // Note: Gemini API requires history to be alternating user/model.
    // We'll start a chat with empty history and just send the message with context in the prompt if needed,
    // or try to use the history properly.
    // A safer approach for a simple implementation is to just send the prompt with context.
    
    // Let's try using the chat feature.
    // We need to ensure the history is valid (alternating roles, starting with user if history is not empty).
    // For now, let's just use the last 10 messages to keep it simple and avoid token limits.
    
    const chat = model.startChat({
      history: history.slice(0, -1).slice(-20), // Last 20 messages, excluding the one we just added
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    // Add AI response
    session.messages.push({
      role: "assistant",
      content: text,
      timestamp: new Date(),
    });

    await session.save();

    res.json({
      message: text,
      response: text, // For compatibility
    });
  } catch (error) {
    logger.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
};

export const deleteSession = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user?._id;
        await ChatSession.findOneAndDelete({ _id: sessionId, userId });
        res.status(200).json({ message: "Session deleted" });
    } catch (error) {
        logger.error("Error deleting session:", error);
        res.status(500).json({ error: "Failed to delete session" });
    }
}
