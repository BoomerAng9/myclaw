import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACHEEVY Studio",
  description: "Visual node-based workflow builder for the GRAMMAR runtime. Build, visualize, and execute ACHEEVY orchestration pipelines.",
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
