// jobagent.js
import { answerQuery } from "./query.js";

// Einfache Agent-Logik: Nutzt das RAG-System und gibt die Antwort zurück
export async function runAgent(query) {
  // Hier könntest du später noch Tools, Memory, etc. einbauen
  return await answerQuery(query);
}
