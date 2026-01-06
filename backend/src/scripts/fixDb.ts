import mongoose from "mongoose";
import dotenv from "dotenv";
import { ChatSession } from "../models/ChatSession";

dotenv.config();

const fixDb = async () => {
  try {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
    
    try {
        // List indexes first
        const indexes = await ChatSession.collection.indexes();
        console.log("Current indexes:", indexes);

        // Try to create a session
        console.log("Attempting to create a session...");
        const session = await ChatSession.create({
            userId: new mongoose.Types.ObjectId(),
            messages: []
        });
        console.log("Created session successfully:", session._id);

    } catch (e: any) {
        console.log("Error:", e.message);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

fixDb();
