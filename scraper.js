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
    const res = await axios.get("https://arbeitnow.com/api/job-board-api", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JobScraper/1.0)",
      },
    });

    const jobsData = res.data.data || [];

    const jobs = jobsData.map((job) => {
      return {
        title: job.title || "",
        company: job.company_name || "",
        location: job.location || "",
        link: job.url || "",
        description: cleanDescription(job.description) || "",
        tags: job.tags || [],
      };
    });

    console.log(`Scraped ${jobs.length} jobs from Arbeitnow API.`);
    console.log("Sample job:", jobs[0]);

    return jobs;
  } catch (error) {
    console.error("Error fetching jobs from Arbeitnow API:", error.message);
    return [];
  }
}

