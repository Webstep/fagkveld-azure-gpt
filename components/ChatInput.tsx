import { KeyboardEvent } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type Props = {
  input: string;
  loading: boolean;
  onChange: (input: string) => void;
  onSend: () => void;
  onReset: () => void;
};

export const ChatInput = ({ input, loading, onChange, onSend, onReset }: Props) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!loading && event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        className="p"
        value={input}
        placeholder="Say something..."
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex flex-row gap-4">
        <Button onClick={onSend} disabled={!input}>
          Send
        </Button>
        <Button onClick={onReset} variant="destructive">
          Reset
        </Button>
      </div>
    </div>
  );
};
