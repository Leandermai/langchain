import axios from "axios";
import { load } from "cheerio";

const API_URL = "https://remoteok.com/api"; // public API

// Helper to strip HTML tags from job descriptions
function cleanDescription(html) {
  if (!html) return "";
  const $ = load(html);
  return $.text().replace(/\s+/g, " ").trim();
}

// Main function to fetch and parse jobs
export async function scrapeJobs() {
  try {
    const res = await axios.get(API_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JobScraper/1.0)",
      },
    });

    // First element is metadata, not a job
    const jobData = res.data.slice(1);

    const jobs = jobData
      .filter((job) => job.position || job.title)
      .map((job) => {
        const title = job.position || job.title;
        const link = job.url;
        const description = cleanDescription(job.description) || (job.tags?.join(", ") ?? "");

        return {
          title,
          company: job.company || "",
          location: job.location || "",
          link,
          description,
          tags: job.tags || [],
        };
      });

    console.log(`Scraped ${jobs.length} jobs.`);
    console.log("Sample job:", jobs[0]);

    return jobs;
  } catch (error) {
    console.error("Error fetching jobs from RemoteOK API:", error.message);
    return [];
  }
}
