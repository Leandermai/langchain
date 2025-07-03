const { getJobs } = require("./scraper");
const { generateApplication } = require("./generateApplication");

async function main() {
  console.log("🔍 Lade Jobs...");
  const jobs = await getJobs();

  if (jobs.length === 0) {
    console.log("❌ Keine Jobs gefunden.");
    return;
  }

  const bestJob = jobs[0]; // Später: Matching-Logik einbauen
  console.log("✅ Job gefunden:", bestJob.title);

  const letter = await generateApplication(bestJob);
  console.log("\n📄 Bewerbungsschreiben:\n");
  console.log(letter);
}

main();
