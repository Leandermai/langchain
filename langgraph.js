import { Graph } from "@langchain/langgraph";
import { chat } from "./llm.js";

const nodes = {
  input: ({ messages }) => messages,
  llm: async ({ messages }) => await chat.invoke(messages),
};

const edges = {
  input: "llm",
  llm: "output",
};

export const graph = new Graph({ nodes, edges, entry: "input" });
