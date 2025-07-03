import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeJobs() {
  const url = "https://remoteok.com/remote-dev-jobs";
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });
  const $ = cheerio.load(data);

  const jobs = [];
  // Hole die ersten 5 Jobs für Demo-Zwecke
  const jobRows = $("tr.job").slice(0, 5);
  for (let i = 0; i < jobRows.length; i++) {
    const el = jobRows[i];
    const title = $(el).find("h2").text().trim();
    const link = $(el).attr("data-href") || $(el).find("a.preventLink").attr("href");
    let description = "";
    if (link) {
      try {
        const detailUrl = link.startsWith("http") ? link : `https://remoteok.com${link}`;
        const detailRes = await axios.get(detailUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
        const $$ = cheerio.load(detailRes.data);
        description = $$(".description").text().trim() || $$(".job-description").text().trim();
      } catch (e) {
        description = "Fehler beim Laden der Detailseite.";
      }
    }
    if (!description) {
      description = "Keine ausführliche Beschreibung gefunden.";
    }
    if (title) {
      jobs.push({ title, description });
    }
  }
  return jobs;
}
