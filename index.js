import { scrapeJobs } from "./scraper.js";
import { matchJobsToSkills } from "./llm.js";

const jobs = await scrapeJobs();
console.log(`Scraped ${jobs.length} jobs.`);

const skills = ["JavaScript", "React", "Node.js"];
const result = await matchJobsToSkills(jobs.slice(0, 10), skills); // Limit for speed
console.log("Top job matches:\n", result);




