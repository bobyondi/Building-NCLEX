import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NCLEX Exam Prep — Free Diagnostic & Personalized Study Plan",
  description:
    "Take a free NCLEX diagnostic, see your strengths and weak spots, and get a personalized study plan — instantly. NCLEX-RN and NCLEX-PN preparation built by nursing educators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
