import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";

export async function answerQuery(userQuery) {
  const vectorStore = await FaissStore.load("faiss.index", new OpenAIEmbeddings());

  const model = new OpenAI({ temperature: 0.3 });

  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

  const result = await chain.call({ query: userQuery });

  return result.text;
}
