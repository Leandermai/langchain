import { ChatGroq } from "@langchain/groq";
import { config } from "dotenv";

config();

export const chat = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

// Hilfsfunktion für das Matching (optional, kann später erweitert werden)
export async function matchJobsToSkills(jobs, skills) {
  // Dummy-Logik: Jobs nach Anzahl passender Skills sortieren
  return jobs
    .map((job) => {
      const matches = skills.filter((skill) =>
        (job.description || "").toLowerCase().includes(skill.toLowerCase())
      );
      return { ...job, matches: matches.length };
    })
    .sort((a, b) => b.matches - a.matches);
}
