import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Text Distiller | AI-Powered Content Summarization",
  description: "Advanced AI text summarization tool for documents, articles, and long-form content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
