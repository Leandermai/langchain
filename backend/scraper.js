import axios from "axios";
import { load } from "cheerio";

// Clean HTML from descriptions, if any
function cleanDescription(html) {
  if (!html) return "";
  const $ = load(html);
  return $.text().replace(/\s+/g, " ").trim();
}

export async function scrapeJobs() {
  try {
    // 10 Sekunden Pause, um Rate Limiting zu vermeiden
    await new Promise((r) => setTimeout(r, 10000));
    const res = await axios.get("https://remoteok.com/api", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://remoteok.com/",
        Accept: "application/json, text/plain, */*",
      },
      timeout: 15000,
    });

    // Die API liefert ein Array, das erste Element ist meist Meta-Info
    const jobsData = Array.isArray(res.data) ? res.data.slice(1) : [];

    // Nur die 10 neuesten Jobs zurückgeben
    const jobs = jobsData.slice(0, 10).map((job) => {
      return {
        title: job.position || job.title || "",
        company: job.company || job.company_name || "",
        location: job.location || "Remote",
        link: job.url || job.apply_url || job.url || "",
        description:
          cleanDescription(job.description) ||
          cleanDescription(job.tags?.join(", ")) ||
          "",
        tags: job.tags || [],
        date: job.date || job.posted || "",
      };
    });

    console.log(`Scraped ${jobs.length} jobs from RemoteOK API.`);
    console.log("Sample job:", jobs[0]);

    return jobs;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error(
        "Rate limit/Bann erkannt. Bitte warte einige Minuten und versuche es erneut."
      );
      return [];
    }
    console.error("Error fetching jobs from RemoteOK API:", error.message);
    return [];
  }
}
