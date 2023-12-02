import OpenAI from "openai";

const apiKey = process.env["AZURE_OPENAI_API_KEY"];
const apiBase = process.env["AZURE_OPENAI_API_BASE_URL"];
const apiVersion = "2023-10-01-preview"; // 2023-12-01-preview has changed the API, so we need to use 2023-10-01-preview

/* Azure not working with OpenAI library ... * /
const openai = new OpenAI({
  apiKey,
  baseURL: `${apiBase}/openai/images/generations:submit?api-version=${apiVersion}`,
  defaultQuery: { "api-version": apiVersion },
  defaultHeaders: { "api-key": apiKey },
});
/**/

export async function POST(req: Request) {
  const { prompt } = await req.json();

  /**
   * Doing it manually because the OpenAI library doesn't work with Azure
   */
  const init = await fetch(`${apiBase}/openai/images/generations:submit?api-version=${apiVersion}`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
    } as any,
    body: JSON.stringify({
      prompt,
      size: "1024x1024",
      n: 1,
    }),
  });

  const newUrl = init.headers.get("Operation-Location");

  if (!newUrl) {
    return new Response(JSON.stringify({ status: "failed" }));
  }

  /**
   * Check Azure every second for 30 seconds to see if the image has been generated
   */
  const response = await new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      resolve({ status: "failed" });
    }, 30_000);
    const intervalId = setInterval(async () => {
      const response = await fetch(newUrl, {
        method: "GET",
        headers: {
          "api-key": apiKey,
        } as any,
      }).then((r) => r.json());
      if (response.status === "succeeded") {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        resolve(response);
      }
    }, 1_000);
  });

  /* Azure not working with OpenAI library ... * /
  const response = await openai.images.generate({
    prompt,
    size: "1024x1024",
    n: 1,
  });
  console.log(response);
  /**/

  return new Response(JSON.stringify(response));
}
