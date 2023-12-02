import fs from "fs";
import http from "http";
import FormData from "form-data";
import fetch from "node-fetch"; // Need to use node-fetch for some reason

export async function POST(req: Request) {
  const { prompt, image, mask } = await req.json();

  const imageStream = fs.createWriteStream("image.png");
  http.get(image, (response) => {
    response.pipe(imageStream);
  });

  const maskStream = fs.createWriteStream("mask.png");
  http.get(mask, (response) => {
    response.pipe(maskStream);
  });

  const body = new FormData();
  const imageBuffer = fs.readFileSync("mask.png");
  body.append("image", imageBuffer, "image.png");
  body.append("prompt", prompt);
  body.append("size", "1024x1024");
  body.append("n", "1");

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env["OPENAI_API_KEY"],
    },
    body,
  }).then((r) => r.json());

  /* Azure not working yet ... * /
  const apiKey = process.env["AZURE_OPENAI_API_KEY"];
  const apiBase = process.env["AZURE_OPENAI_API_BASE_URL"];
  const apiVersion = process.env["AZURE_OPENAI_API_VERSION"];
  const response = await fetch(`${apiBase}/openai/images/generations:submit?api-version=${apiVersion}`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
    } as any,
    body,
  }).then((r) => r.json());
  /**/

  /* OpenAI library causes an error ... * /
  const response = await openai.images.edit({
    image: fs.createReadStream("image.png"),
    mask: fs.createReadStream("mask.png"),
    prompt: "A cute baby sea otter wearing a beret",
    size: "1024x1024",
  });
  console.log(response);
  /**/

  return new Response(JSON.stringify(response));
}
