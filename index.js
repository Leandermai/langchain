import { ChatGroq } from "@langchain/groq";
import { Graph } from "@langchain/langgraph";
import { config } from "dotenv";

config();

async function main() {
  const chat = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
  });

  const messages = [
    { role: "system", content: "you are a good assistant." },
    { role: "user", content: "what is langchain" },
  ];

  const response = await chat.invoke(messages);
  console.log("LLM response:", response.content);
}

main();





