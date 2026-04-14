import type { Metadata, Viewport } from "next";

import "./globals.css";
import { PwaRegistration } from "@/components/pwa/pwa-registration";

export const metadata: Metadata = {
  title: "Medibank",
  description: "Secure multi-profile family health vault and assistant",
  applicationName: "Medibank",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Medibank",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f9ff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-app-bg text-app-text antialiased">
        <PwaRegistration />
        {children}
      </body>
    </html>
  );
}
