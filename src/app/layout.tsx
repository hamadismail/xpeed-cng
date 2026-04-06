import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layouts/navbar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xpeed CNG Operations",
  description: "Operational dashboard for Xpeed Energy station reporting and pricing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <div className="relative min-h-screen overflow-x-clip">
          <div className="pointer-events-none fixed inset-0 -z-10 print:hidden">
            <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,_rgba(12,120,102,0.18),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(188,149,78,0.12),_transparent_36%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(250,248,242,0.86),_rgba(250,248,242,1))]" />
            <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:5rem_5rem]" />
          </div>
          <div className="print:hidden">
            <Navbar />
          </div>
          <main className="relative z-10 pb-16 print:pb-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
