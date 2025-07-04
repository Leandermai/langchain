import express from "express";
import cors from "cors";
import { scrapeJobs } from "./scraper.js";
import { chat } from "./llm.js";
import path from "path";
import { fileURLToPath } from "url";
import { chatbot } from './chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Jobs-API
app.get("/api/jobs", async (req, res) => {
  try {
    // Filter-Parameter aus Query lesen
    const { skills = "", bereich = "" } = req.query;
    const skillArr = skills.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const bereichArr = bereich.split(",").map(b => b.trim().toLowerCase()).filter(Boolean);
    const jobs = await scrapeJobs();
    // Filterung: Mindestens ein Skill ODER ein Bereich muss im Titel, Tags oder Beschreibung vorkommen
    const filtered = jobs.filter(job => {
      const text = [job.title, job.description, ...(job.tags||[])].join(" ").toLowerCase();
      const skillMatch = skillArr.length === 0 ? false : skillArr.some(skill => text.includes(skill));
      const bereichMatch = bereichArr.length === 0 ? false : bereichArr.some(bereich => text.includes(bereich));
      // Wenn beide leer: alles anzeigen. Wenn nur eins gefüllt: darauf filtern. Wenn beide gefüllt: ODER-Verknüpfung.
      if (skillArr.length === 0 && bereichArr.length === 0) return true;
      return skillMatch || bereichMatch;
    });
    res.json(filtered);
  } catch (e) {
    res.status(500).json({ error: "Fehler beim Scrapen der Jobs." });
  }
});

// Bewerbung-API
app.post("/api/bewerbung", async (req, res) => {
  const { job, name, email, profil } = req.body;
  if (!job || !name || !email) {
    return res.status(400).json({ error: "Fehlende Felder." });
  }
  // Prompt für das LLM
  const prompt = [
    { role: "system", content: "Du bist ein Bewerbungsassistent." },
    { role: "user", content: `Schreibe ein Bewerbungsschreiben für die Stelle '${job.title}'. Name: ${name}, E-Mail: ${email}.` + (profil ? ` Über mich: ${profil}.` : "") + ` Jobbeschreibung: ${job.description}` }
  ];
  try {
    const response = await chat.invoke(prompt);
    res.json({ letter: response.content });
  } catch (e) {
    res.status(500).json({ error: "Fehler beim Generieren der Bewerbung." });
  }
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await chatbot.call({ input: message });
    res.json({ response: response.response || response.text || JSON.stringify(response) });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
