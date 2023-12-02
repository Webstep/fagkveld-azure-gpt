import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl">WebstepGPT</h1>
      <Link href="/chat">Chat</Link>
      <Link href="/function-calling">Weather chat (Function Calling)</Link>
      <Link href="/image-edit">Edit images (Dalle-2)</Link>
    </div>
  );
}
