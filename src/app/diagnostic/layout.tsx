"use client";

import { AppProvider } from "@/lib/store";

export default function DiagnosticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppProvider>{children}</AppProvider>;
}
