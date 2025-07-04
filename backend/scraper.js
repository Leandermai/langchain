import axios from "axios";
import * as cheerio from "cheerio";
import { extractJobSections } from "./rag.js";

// Clean HTML from descriptions, if any
function cleanDescription(html) {
  if (!html) return "";
  const $ = cheerio.load(html);
  return $.text().replace(/\s+/g, " ").trim();
}

export async function scrapeJobs() {
  const url = "https://remoteok.com/remote-dev-jobs";
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  const $ = cheerio.load(data);

  const jobs = [];
  // Hole die ersten 20 Jobs für bessere Abdeckung
  const jobRows = $("tr.job").slice(0, 20);
  for (let i = 0; i < jobRows.length; i++) {
    const el = jobRows[i];
    const title = $(el).find("h2").text().trim();
    const company = $(el).find("h3").text().trim();
    const location = $(el).find("div.location").text().trim();
    const tags = $(el)
      .find(".tags .tag")
      .map((i, tag) => $(tag).text().trim())
      .get();
    const salary = $(el).find(".salary").text().trim();
    const date = $(el).find("time").attr("datetime") || "";
    const link =
      $(el).attr("data-href") || $(el).find("a.preventLink").attr("href");
    let description = "";
    if (link) {
      try {
        const detailUrl = link.startsWith("http")
          ? link
          : `https://remoteok.com${link}`;
        const detailRes = await axios.get(detailUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        const $$ = cheerio.load(detailRes.data);
        description =
          $$(".description").text().trim() ||
          $$(".job-description").text().trim();
      } catch (e) {
        description = "Fehler beim Laden der Detailseite.";
      }
    }
    if (!description) {
      description = "Keine ausführliche Beschreibung gefunden.";
    }
    if (title) {
      // RAG: Abschnitte extrahieren
      const sections = extractJobSections(description);
      jobs.push({
        title,
        company,
        location,
        tags,
        salary,
        date,
        link: link
          ? link.startsWith("http")
            ? link
            : `https://remoteok.com${link}`
          : "",
        description: cleanDescription(description),
        ...sections,
      });
    }
  }
  return jobs;
}
