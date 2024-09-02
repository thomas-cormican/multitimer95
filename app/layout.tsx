import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import GlobalStyle from "./../styles/GlobalStyle";

export const metadata: Metadata = {
  title: "Multi-Timer 95",
  description: "A retro Windows 95 style multi-timer application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalStyle />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
