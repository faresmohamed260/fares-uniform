import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fares Uniform — Pattern in Motion review",
  description: "Isolated multi-organization kinetic design prototype for Fares Uniform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
