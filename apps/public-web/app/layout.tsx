import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fares Uniform",
  description: "Uniform programs for schools, hospitality, restaurants, healthcare and growing teams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
