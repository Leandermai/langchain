import { chat as baseModel } from "./llm.js";
import { ChatGroq } from "@langchain/groq";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { RunnableSequence } from "@langchain/core/runnables";
import { DynamicTool } from "langchain/tools";
import { matchJobsToSkills } from "./llm.js";
import { pull } from "langchain/hub";
import dotenv from "dotenv";
dotenv.config(); 

const memory = new BufferMemory(); // Simple in-memory conversation

//export const chatbot = new ConversationChain({
//  llm: baseModel,
//  memory,
//});

const jobMatchTool = new DynamicTool({
  name: "jobMatcher",
  description: "Matches user skills to available jobs",
  func: async (input) => {
    const { jobs, skills } = JSON.parse(input);
    const matched = await matchJobsToSkills(jobs, skills);
    return JSON.stringify(matched, null, 2);
  },
});

const prompt = await pull("hwchase17/openai-functions-agent"); // pulls default prompt template

const agent = RunnableSequence.from([
  prompt,
  model.bind({ functions: [jobMatchTool] }),
  new RunnableAgent({ tools: [jobMatchTool] }),
]);

export const chatbot = new AgentExecutor({
  agent,
  tools: [jobMatchTool],
  verbose: true,
});