import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horizon – Personal Concierge",
  description: "Personal matches for food & places",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
