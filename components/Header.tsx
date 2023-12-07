"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <div className="mb-4">
      <Link href="/" className="flex flex-row items-center gap-1">
        <ArrowLeft size={16} />
        Home
      </Link>
    </div>
  );
};
