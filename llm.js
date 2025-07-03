import { ChatGroq } from "@langchain/groq";
import { config } from "dotenv";

config();

export const chat = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});
