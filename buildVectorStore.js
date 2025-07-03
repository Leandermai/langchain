import { scrapeJobs } from "./scraper.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";

export async function buildVectorStore() {
  const jobs = await scrapeJobs();

  const allTexts = jobs.map(job => job.description).filter(Boolean);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = [];
  for (const text of allTexts) {
    const splitChunks = await splitter.splitText(text);
    chunks.push(...splitChunks);
  }

  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await FaissStore.fromTexts(chunks, [], embeddings);

  await vectorStore.save("faiss.index");

  return vectorStore;
}