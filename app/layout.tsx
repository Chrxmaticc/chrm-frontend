import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "chrm | selfbot",
  description: "The ultimate selfbot engine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
