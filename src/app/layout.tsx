import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UIProvider } from "@/providers/UIProvider";
import ThemeSwitch from "@/components/theme-switch";
import ThemeSwitchWrapper from "@/components/theme-switch-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <UIProvider>
          <ThemeSwitchWrapper />
          {children}
        </UIProvider>
      </body>
    </html>
  );
}
