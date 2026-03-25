"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["700", "800"] });

export const Navbar = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-chess-bg/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm border-b border-transparent dark:border-slate-800/50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="text-2xl font-extrabold text-chess-dark dark:text-slate-100 cursor-pointer flex items-center gap-2"
          onClick={() => onNavigate('landing')}
        >
          <img src="/pieces/bP.svg" alt="Logo" className="w-8 h-8" />
          <span className={`${cinzel.className} tracking-widest text-3xl font-extrabold mt-1`}>CHECKMATE</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="/selection" className="text-sm font-semibold text-chess-dark dark:text-slate-100 border-b-2 border-chess-dark dark:border-slate-100 pb-1">Play</a>
          <a href="#" className="text-sm font-semibold text-slate-500 hover:text-chess-dark dark:hover:text-slate-100 transition-colors">Learn</a>
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-slate-100" /> : <Moon className="w-5 h-5 text-slate-900" />}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
