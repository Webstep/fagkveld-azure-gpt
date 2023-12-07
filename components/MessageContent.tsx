import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const MessageContent = ({ children }: { children: string }) => {
  return (
    <article className="prose dark:prose-invert">
      <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
    </article>
  );
};
