import OpenAI from "openai";

const apiKey = process.env["AZURE_OPENAI_API_KEY"];
const apiBase = process.env["AZURE_OPENAI_API_BASE_URL"];
const deploymentModel = process.env["AZURE_OPENAI_API_MODEL"]!;
const apiVersion = process.env["AZURE_OPENAI_API_VERSION"];

const openai = new OpenAI({
  apiKey,
  baseURL: `${apiBase}/openai/deployments/${deploymentModel}`,
  defaultQuery: { "api-version": apiVersion },
  defaultHeaders: { "api-key": apiKey },
});

export const runtime = "edge";

const getWeather = async ({ location }: { location: string }) => {
  const response = await fetch(`https://wttr.in/${location}?format=j2`);
  const data = await response.json();
  const { current_condition } = data;
  return JSON.stringify(current_condition[0]);
};

const functions = [
  {
    name: "getWeather",
    description: "Get the weather for a given location.",
    parameters: {
      type: "object",
      properties: {
        location: { type: "string", description: "The location to get the weather for." },
      },
      required: ["location"],
    },
  },
];

const functionCalls = {
  getWeather,
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  let response = await openai.chat.completions.create({
    model: deploymentModel,
    messages,
    functions,
  });

  while (true) {
    const { finish_reason, message } = response.choices[0];

    if (finish_reason === "stop") {
      break;
    }

    if (finish_reason === "function_call") {
      const { name: functionName, arguments: functionArgs = {} } = message.function_call || {};
      if (functionName) {
        const returnValue = await functionCalls[functionName as keyof typeof functionCalls](functionArgs as any);

        messages.push({
          role: "assistant",
          content: null,
          function_call: {
            name: functionName,
            arguments: functionArgs,
          },
        });

        messages.push({
          role: "function",
          content: returnValue,
          name: functionName,
        });

        response = await openai.chat.completions.create({
          model: deploymentModel,
          messages,
          functions,
        });
      }
    }
  }

  return new Response(JSON.stringify(response));
}
