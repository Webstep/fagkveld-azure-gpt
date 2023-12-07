"use client";

import { useState } from "react";
import { ErrorInfo } from "@/components/ErrorInfo";
import { LoadingImage } from "@/components/LoadingMessage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ImageGeneration() {
  const [input, setInput] = useState("A cute baby sea otter wearing a beret");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const sendMessage = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/image-generation", {
        method: "POST",
        body: JSON.stringify({ prompt: input }),
      }).then((r) => r.json());

      if (response.status === "succeeded") {
        setImages((images) => [response.result.data[0].url, ...images]);
      } else {
        setError("Rakk ikke å generere et bilde innen 30 sekunder. Prøv igjen.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not send message right now.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl">Generate images</h1>
      <p className="text-gray-500">Requires "East US" or "Sweden Central" in Azure OpenAI Service.</p>
      <div className="flex flex-col gap-4 items-start">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} />
        <Button onClick={sendMessage}>Send</Button>
      </div>
      {error && !loading && <ErrorInfo {...{ error }} />}
      <div className="flex flex-row flex-wrap items-center gap-6">
        {loading && <LoadingImage className="rounded-lg flex-1 min-w-[200px] max-w-[420px]" />}
        {images.map((image) => (
          <img
            key={image}
            src={image || "/image.png"}
            alt="Test"
            className="rounded-lg flex-1 min-w-[200px] max-w-[420px]"
          />
        ))}
      </div>
    </div>
  );
}
