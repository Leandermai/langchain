import { ChatGroq } from "@langchain/community/chat_models/groq";
import { config } from "dotenv";

config();

export const chat = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "mixtral-8x7b-32768",
});
