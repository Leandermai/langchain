import readline from "readline";
import { answerQuery } from "./query.js"; // or `runAgent` if you want smarter answers

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chatLoop() {
  console.log("🧠 Welcome to the JobBot! Ask me about jobs. Type 'exit' to quit.");

  while (true) {
    const question = await new Promise(resolve => rl.question("You: ", resolve));

    if (question.toLowerCase() === "exit") {
      rl.close();
      console.log("👋 Goodbye!");
      break;
    }

    try {
      const answer = await answerQuery(question); // or runAgent(question)
      console.log("Bot:", answer, "\n");
    } catch (err) {
      console.error("Error processing query:", err.message);
    }
  }
}

chatLoop();
