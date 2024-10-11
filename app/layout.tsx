import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Export LDS Notes",
  description:
    "This tool will help you convert your notes from the LDS website so that you can have access to them in your favorite note-taking app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <main>{children}</main>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
