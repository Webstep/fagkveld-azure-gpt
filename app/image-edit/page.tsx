"use client";

import { useState } from "react";
import { ErrorInfo } from "@/components/ErrorInfo";
import { LoadingImage } from "@/components/LoadingMessage";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ImageEdit() {
  const [input, setInput] = useState("A cute baby sea otter wearing a beret");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const sendMessage = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await fetch("/api/image-edit", {
        method: "POST",
        body: JSON.stringify({
          prompt: input,
          image: window.origin + "/image.png",
          mask: window.origin + "/mask.png",
        }),
      }).then((r) => r.json());

      setImage(result.data[0].url);
    } catch (err) {
      console.error(err);
      setError("Could not send message right now.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl">Edit images</h1>
      <p className="text-gray-500">
        Requires setting `OPENAI_API_KEY` (from OpenAI), since it is not working in Azure OpenAI Service yet.
      </p>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} />
        <Button onClick={sendMessage}>Send</Button>
      </div>
      {error && !loading && <ErrorInfo {...{ error }} />}
      <div className="flex flex-row gap-4 items-center">
        <img src="/mask.png" alt="Test" className="rounded-lg flex-1 min-w-0" />
        <ArrowRight size={24} />
        {loading ? (
          <LoadingImage />
        ) : (
          <img src={image || "/image.png"} alt="Test" className="rounded-lg flex-1 min-w-0" />
        )}
      </div>
    </div>
  );
}
