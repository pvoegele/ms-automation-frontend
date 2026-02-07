import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MS Automation - OneDrive Email Flow",
  description: "Low-code automation for email to OneDrive storage",
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
