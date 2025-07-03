import express from "express";
import cors from "cors";
import { scrapeJobs } from "./scraper.js";
import { chat } from "./llm.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Jobs-API
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await scrapeJobs();
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ error: "Fehler beim Scrapen der Jobs." });
  }
});

// Bewerbung-API
app.post("/api/bewerbung", async (req, res) => {
  const { job, name, email } = req.body;
  if (!job || !name || !email) {
    return res.status(400).json({ error: "Fehlende Felder." });
  }
  // Prompt für das LLM
  const prompt = [
    { role: "system", content: "Du bist ein Bewerbungsassistent." },
    { role: "user", content: `Schreibe ein Bewerbungsschreiben für die Stelle '${job.title}'. Name: ${name}, E-Mail: ${email}. Jobbeschreibung: ${job.description}` }
  ];
  try {
    const response = await chat.invoke(prompt);
    res.json({ letter: response.content });
  } catch (e) {
    res.status(500).json({ error: "Fehler beim Generieren der Bewerbung." });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
