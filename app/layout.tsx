import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "골프 트렌드 정보",
  description: "매주 골프 트렌드 정보를 공유하는 게시판",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
