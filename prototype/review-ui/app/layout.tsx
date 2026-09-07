import type { Metadata } from "next";
import "./globals.css";
import "./reduced-motion.css";

export const metadata: Metadata = {
  title: "Fares Uniform — Phase 0B Review",
  description: "Synthetic bilingual UI review surfaces for Fares Uniform Phase 0B.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
