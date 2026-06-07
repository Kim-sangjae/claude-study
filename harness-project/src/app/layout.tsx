import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CS Quiz",
  description: "CS 기초 지식을 30문제로 점검하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-[#0a0a0a] min-h-screen text-white antialiased">
        {children}
      </body>
    </html>
  );
}
