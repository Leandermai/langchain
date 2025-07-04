import { chat as baseModel } from "./llm.js";
import { ChatGroq } from "@langchain/groq";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import dotenv from "dotenv";
dotenv.config(); 

const memory = new BufferMemory(); // Simple in-memory conversation

export const chatbot = new ConversationChain({
  llm: baseModel,
  memory,
});
