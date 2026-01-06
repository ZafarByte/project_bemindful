
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");
  const modelsToTest = [
    "gemini-2.5-flash",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: "You are a helpful assistant."
      });
      const result = await model.generateContent("Hello");
      console.log(`SUCCESS with ${modelName}:`, result.response.text());
      return; // Stop after first success
    } catch (error: any) {
      console.error(`FAILED with ${modelName}:`, error.message.split('\n')[0]);
    }
  }
}

listModels();
