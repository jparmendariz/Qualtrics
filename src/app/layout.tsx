import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RX Hub - Research Experience Hub",
  description:
    "Plataforma centralizada para Research Managers. Automatiza y estandariza el proceso de investigacion de clientes.",
  keywords: [
    "research",
    "qualtrics",
    "survey",
    "automation",
    "research manager",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">{children}</div>
      </body>
    </html>
  );
}
