import axios from "axios";
import { load } from "cheerio";

const BASE_URL = "https://remoteok.com";
const JOBS_URL = `${BASE_URL}/remote-dev-jobs`;

async function scrapeJobDescription(jobUrl) {
  try {
    const res = await axios.get(jobUrl, {
      headers: {
        // sometimes setting user-agent helps avoid blocks
        "User-Agent": "Mozilla/5.0 (compatible; JobScraper/1.0)",
      },
    });
    const $ = load(res.data);

    // Inspect the job detail page to find the description selector.
    // For RemoteOK, the job description is inside a div with class 'description'
    const description = $(".description").text().trim();

    return description;
  } catch (error) {
    console.error(`Error fetching job description from ${jobUrl}:`, error.message);
    return "";
  }
}

export async function scrapeJobs() {
  try {
    const res = await axios.get(JOBS_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JobScraper/1.0)",
      },
    });
    const $ = cheerio.load(res.data);
    const jobs = [];

    $(".job").each((i, el) => {
      const title = $(el).find("h2").text().trim();
      const relativeLink = $(el).find("a.preventLink").attr("href");
      if (!title || !relativeLink) return;

      const link = BASE_URL + relativeLink;
      jobs.push({ title, link });
    });

    // For each job, scrape the full job description
    for (const job of jobs) {
      job.description = await scrapeJobDescription(job.link);
    }

    return jobs;
  } catch (error) {
    console.error("Error fetching job listings:", error.message);
    return [];
  }
}


