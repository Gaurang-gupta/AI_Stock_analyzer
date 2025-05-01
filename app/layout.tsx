"use client"

import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import Sidebar from "@/components/Sidebar";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400","500", "600", "700"],
})

// export const metadata: Metadata = {
//   title: "AI Stock Research",
//   description: "AI-Powered Stock Market Insights",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <AuthProvider>
            <ThemeProvider>
                <div className="flex">
                    <div className="flex-1">
                        <Navbar/>
                        {children}
                        <Toaster />
                    </div>
                </div>
            </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
