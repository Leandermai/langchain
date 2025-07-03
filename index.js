import { buildVectorStore } from "./buildVectorStore.js";
import { answerQuery } from "./query.js";

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
  } else {
    console.log(`Usage:
    node index.js build        # scrape jobs & build vector store
    node index.js query QUERY  # query the RAG system`);
  }
}

main().catch(console.error);




