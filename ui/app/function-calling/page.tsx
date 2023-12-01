"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChatInput } from "@/components/ChatInput";
import { ErrorInfo } from "@/components/ErrorInfo";
import { Loading } from "@/components/LoadingMessage";
import { MessageContent } from "@/components/MessageContent";
import type { Message } from "@/lib/types";

export default function Chat() {
  const [input, setInput] = useState("What is the weather in Oslo?");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    const prevInput = input;
    const messagesOld = [...messages];
    const messagesNew = [...messages, { role: "user", content: input } as Message];

    setLoading(true);
    setMessages(messagesNew);
    setInput("");

    try {
      const result = await fetch("/api/chat/function-calling", {
        method: "POST",
        body: JSON.stringify({ messages: messagesNew }),
      }).then((r) => r.json());

      const { content, role } = result.choices[0].message;

      setMessages((messages) => [...messages, { role, content }]);
    } catch (err) {
      console.error(err);
      setError("Could not send message right now.");
      setMessages(messagesOld);
      setInput(prevInput);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl">Chat</h1>
      <div className="flex flex-col gap-4">
        {messages.map((message, i) => (
          <Card key={i}>
            <CardContent className="pt-6 relative">
              {message.role === "assistant" ? <Badge className="absolute top-[-10px] left-4">GPT</Badge> : null}
              <MessageContent>{message.content}</MessageContent>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && <Loading />}
      {error && !loading && <ErrorInfo {...{ error }} />}

      <ChatInput
        {...{
          input,
          loading,
          onChange: setInput,
          onSend: sendMessage,
          onReset: () => {
            setInput("");
            setMessages([]);
          },
        }}
      />
    </div>
  );
}
