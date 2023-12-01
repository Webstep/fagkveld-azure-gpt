import OpenAI from "openai";

const apiKey = process.env["AZURE_OPENAI_API_KEY"];
const apiBase = process.env["AZURE_OPENAI_API_BASE_URL"];
const deploymentModel = process.env["AZURE_OPENAI_API_MODEL"] || "gpt-4";
const apiVersion = process.env["AZURE_OPENAI_API_VERSION"] || "2023-10-01-preview";

const openai = new OpenAI({
  apiKey,
  baseURL: `${apiBase}/openai/deployments/${deploymentModel}`,
  defaultQuery: { "api-version": apiVersion },
  defaultHeaders: { "api-key": apiKey },
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: deploymentModel,
    messages,
  });

  return new Response(JSON.stringify(response));
}
