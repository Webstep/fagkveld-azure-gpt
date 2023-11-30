"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { useState, KeyboardEvent } from "react";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    const newMessages = [...messages, { role: "user", content: input } as Message];
    const prevInput = input;

    setLoading(true);
    setMessages(newMessages);
    setInput("");

    try {
      const body = JSON.stringify({ messages: newMessages });
      const result = await fetch("/api/chat", {
        method: "POST",
        body,
      }).then((res) => res.json());
      const content = result.choices[0]!.message?.content;
      const role = result.choices[0]!.message?.role || "assistant";
      setMessages((messages) => [...messages, { role, content }]);
    } catch (err) {
      console.error(err);
      setError("Could not send message.");
      setInput(prevInput);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!loading && event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl">Chat</h1>
      <div className="flex flex-col gap-4">
        {messages.map((message, i) => (
          <Card key={i}>
            <CardContent className="pt-6 relative">
              {message.role === "assistant" ? <Badge className="absolute top-[-10px] left-4">GPT</Badge> : null}
              {message.content}
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}

      {error && !loading && (
        <Alert color="red">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Textarea
        className="p"
        value={input}
        placeholder="Say something..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex flex-row gap-4">
        <Button onClick={sendMessage} disabled={!input}>
          Send
        </Button>
        <Button
          onClick={() => {
            setMessages([]);
          }}
          variant="destructive"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
