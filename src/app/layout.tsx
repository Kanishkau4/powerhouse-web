import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/landing/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PowerHouse | AI-Powered Fitness Revolution",
  description: "Transform your fitness journey with AI meal scanning, smart workout tracking, and gamified challenges. Your personal AI fitness companion.",
  keywords: ["fitness app", "AI meal scanner", "workout tracker", "calorie counter", "fitness gamification"],
  authors: [{ name: "PowerHouse Team" }],
  openGraph: {
    title: "PowerHouse | AI-Powered Fitness Revolution",
    description: "Transform your fitness journey with AI meal scanning and gamified workouts",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}