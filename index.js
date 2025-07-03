import { graph } from "./graph.js";

const response = await graph.invoke({
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(response);



