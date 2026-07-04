import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KAMDRIDI // War Machines Japanese Protocol",
  description: "Single manifest deployment interface for the Kamdridi Japanese release.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
