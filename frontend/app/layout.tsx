import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TENAR",
  description: "AI-powered export compliance and monitoring"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
