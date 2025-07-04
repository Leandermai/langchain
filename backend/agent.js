simport { initializeAgentExecutorWithOptions, Tool } from "langchain/agents";
import { chat } from "./llm.js";
import { scrapeJobs } from "./scraper.js";
import { matchJobsToSkills } from "./llm.js";

const scrapeTool = new Tool({
  name: "scrape_jobs",
  description: "Scrapes the latest remote jobs",
  func: async () => {
    const jobs = await scrapeJobs();
    return JSON.stringify(jobs.slice(0, 5));
  },
});

const filterTool = new Tool({
  name: "filter_jobs",
  description: "Filter a list of jobs based on given skills",
  func: async (input) => {
    const { jobs, skills } = JSON.parse(input);
    const filtered = await matchJobsToSkills(jobs, skills);
    return JSON.stringify(filtered.slice(0, 5));
  },
});

export async function createAgentExecutor() {
  return initializeAgentExecutorWithOptions(
    [scrapeTool, filterTool],
    chat,
    {
      agentType: "zero-shot-react-description",
      verbose: true,
    }
  );
}


