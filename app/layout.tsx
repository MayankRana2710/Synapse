import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'

import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/providers/theme-providers";
import ModalProvider from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

// IMPORT YOUR NEW CURSOR HERE
import { CustomCursor } from "@/components/global/custom-cursor";

// 1. Load the Outfit font with the specific weights from your spec
const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Synapse",
  description: "Team chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        {/* 2. Pure black body, hide scrollbars, hide default cursor, setup font */}
        <body className={cn(
          outfit.variable,
          "bg-black font-sans text-white/[0.85] overflow-hidden cursor-none antialiased selection:bg-white/[0.1] selection:text-white"
        )}>
          
          {/* DROP THE CURSOR HERE: It will persist across all routes and sit at z-[9999] */}
          <CustomCursor />

          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>
                
                {/* 3. The main page wrapper with your specific off-black tint */}
                <main className="relative flex h-screen w-full flex-col bg-[#050505]">
                  {children}
                </main>
                
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}