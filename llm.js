// llm.js
import { ChatGroq } from "@langchain/groq";
import { config } from "dotenv";

config();

const chat = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", // or your preferred Groq model
});

// This function takes a job description and your skills and decides if it's a good match
export async function matchJobsToSkills(jobDescription, skills) {
  const messages = [
    {
      role: "system",
      content: "You are an AI assistant that helps users find job listings that match their skills.",
    },
    {
      role: "user",
      content: `Here are the user's skills: ${skills.join(", ")}.\n\nDoes this job description match?:\n${jobDescription}\n\nRespond with 'Match' or 'No match' and explain why.`,
    },
  ];

  const response = await chat.invoke(messages);
  return response.content;
}
