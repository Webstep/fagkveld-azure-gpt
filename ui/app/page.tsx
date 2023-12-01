import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl">WebstepGPT</h1>
      <Link href="/chat">Chat</Link>
      <Link href="/profile">Profile</Link>
    </div>
  );
}
