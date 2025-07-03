import { scrapeJobs } from "./scraper.js";

async function main() {
  const jobs = await scrapeJobs();

  if (jobs.length === 0) {
    console.log("No jobs found.");
    return;
  }

  console.log(`Scraped ${jobs.length} jobs from Arbeitnow API.\n`);

  // Print top 5 job listings (or fewer if less)
  const topJobs = jobs.slice(0, 5);

  topJobs.forEach((job, i) => {
    console.log(`Job #${i + 1}:`);
    console.log(`Title: ${job.title}`);
    console.log(`Company: ${job.company}`);
    console.log(`Location: ${job.location}`);
    console.log(`Link: ${job.link}`);
    console.log(`Description (snippet): ${job.description.substring(0, 200)}...`);
    console.log(`Tags: ${job.tags.join(", ")}`);
    console.log("---------------------------------------------------");
  });
}

main().catch((err) => {
  console.error("Error in main execution:", err);
});





