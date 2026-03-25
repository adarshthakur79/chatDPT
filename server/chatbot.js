import readline from "node:readline/promises";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import dotenv from "dotenv";
dotenv.config(); // 👈 sabse pehle

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generate(userMessage) {
  const messages = [
    {
      role: "system",
      content: `You are a smart personal assistant.
      if you know the answer to a question , answer it directly in plain english.
      if the answer requires real-time, local,or up-to-date information,or if you don't know the answer,use the available,use the available tools to find it.
      you gave acces to the following tool:
      webSearch(query: string): use this to search the internet for current or unknown information.

      decide when to use your own knowledge and when to use the tool.
      do not mention the tool unless needed.

      Example :
      Q. What is the capital of France?
      A: The capital of France in Paris.

      Q: What's the weather in Mumbai right now?
      A: (use the search tool to find the latest weather)

      Q: Who is the prime Minister of India?
      A: The current Prime Minister of India is Narendra Modi.

      Q.Tell me the latest IT news.
      A:  (use the search tool to get the latest news)

      current date and time :${new Date().toUTCString()}

      `,
    },
    // {
    //   role: "user",
    //   content: "When was iphone 16 launched?",
    //   //What is the current weather in Mumbai?
    // },
  ];

  messages.push({
    role: "user",
    content: userMessage,
  });

  while (true) {
    const completions = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: messages,

      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Search the latest information and realtim e data on the internet",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query to perform search on.",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });
    messages.push(completions.choices[0].message);
    const toolCalls = completions.choices[0].message.tool_calls;
    if (!toolCalls) {
      return completions.choices[0].message.content;
    }

    for (const tool of toolCalls) {
      const functionName = tool.function.name;
      const functionParams = tool.function.arguments;

      if (functionName === "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionParams));
        // console.log(toolResult);
        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }
  }
}

async function webSearch({ query }) {
  // Here we will do tavily api call
  console.log("Calling websearch....");

  const response = await tvly.search(query);
  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");
  return finalResult;
}
// webSearch();
