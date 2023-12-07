import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "WebstepGPT",
  description: "WebstepGPT",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("dark min-h-screen bg-background font-sans antialiased p-8", inter.variable)}>
        <Header />
        {children}
      </body>
    </html>
  );
}
