import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Tool } from "@langchain/core/tools";
import dotenv from "dotenv";

dotenv.config();

async function loadVectorStore() {
  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await FaissStore.load("faiss.index", embeddings);
  return vectorStore;
}

export async function runAgent(query) {
  const vectorStore = await loadVectorStore();

  const retriever = vectorStore.asRetriever();

  // Custom tool using your vector store
  const jobSearchTool = new Tool({
    name: "JobSearch",
    description: "Use this tool to find job descriptions relevant to the user's query",
    func: async (input) => {
      const docs = await retriever.getRelevantDocuments(input);
      return docs.map((doc) => doc.pageContent).join("\n---\n");
    },
  });

  const model = new ChatOpenAI({ temperature: 0 });

  const executor = await initializeAgentExecutorWithOptions(
    [jobSearchTool],
    model,
    {
      agentType: "openai-functions", // Best with tools
      verbose: true,
    }
  );

  const result = await executor.run(query);
  return result;
}
