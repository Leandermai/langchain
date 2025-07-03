import { buildVectorStore } from "./buildVectorStore.js";
import { answerQuery } from "./query.js";
import { runAgent } from "./jobagent.js";

async function main() {
  const action = process.argv[2];

  if (action === "build") {
    // Build the vector store from scraped jobs
    await buildVectorStore();
  } else if (action === "query") {
    // Run query from command line args after "query"
    const query = process.argv.slice(3).join(" ");
    if (!query) {
      console.error("Please provide a query after 'query' command.");
      process.exit(1);
    }
    const answer = await answerQuery(query);
    console.log("Answer:\n", answer);
  } else if (action === "agent") {
    // Run the agent to answer the query
    const query = process.argv.slice(3).join(" ");
    if (!query) {
      console.error("Please provide a query after 'agent' command.");
      process.exit(1);
    }
    const answer = await runAgent(query);
    console.log("Agent answer:\n", answer);
  } else {
    console.log(`Usage:
    node index.js build         # Scrape jobs & build vector store
    node index.js query QUERY   # Query the RAG system
    node index.js agent QUERY   # Ask the agent for a smart response`);
  }
}

main().catch(console.error);



