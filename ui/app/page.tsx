"use client";

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
    if (event.key === "Enter" && event.shiftKey === false) {
      sendMessage();
    }
  };

  return (
    <div>
      {messages.map((m, i) => (
        <div key={i}>
          {m.role}: {m.content}
        </div>
      ))}

      {loading && <div>Loading...</div>}
      {error && !loading && <div className="text-red-500">{error}</div>}

      <textarea
        value={input}
        placeholder="Say something..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={sendMessage} disabled={!input}>
        Send
      </button>
    </div>
  );
}
