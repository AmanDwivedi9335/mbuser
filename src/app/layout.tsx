import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Medibank",
  description: "Secure multi-profile family health vault and assistant",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-app-bg text-app-text antialiased">{children}</body>
    </html>
  );
}
