import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ChatGroq } from "@langchain/groq";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });


export const chat = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama3-70b-8192", 
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
