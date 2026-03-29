import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";

const outfit = Outfit({
  variable: "--font-inter", // keeping variable name to avoid refactoring all CSS instances
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-manrope", // keeping variable name to avoid refactoring all CSS instances
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Checkmate",
  description: "Modern Chess, Reimagined",
  icons: {
    icon: "/pieces/bP.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-chess-bg text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
