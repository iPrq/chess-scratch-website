"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Bolt, Cpu, Lightbulb, Timer, MessageSquare, BarChart3, Clock, LayoutDashboard } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { useRouter } from "next/navigation";
import { backendUrl } from "@/lib/backend";

const Hero = ({ onPlayNow, onSelectRival }: { onPlayNow: () => void; onSelectRival: () => void }) => (
  <section className="relative pt-24 pb-32 px-6 text-center max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-chess-green-10 text-chess-green text-xs font-bold tracking-widest uppercase mb-8"
    >
      <span className="w-2 h-2 rounded-full bg-chess-green animate-pulse" />
      <span>Now in Alpha</span>
    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-8 leading-[1.05] sm:leading-[0.95]"
    >
      Modern Chess, <br />
      <span className="text-chess-green italic">Reimagined</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed px-4"
    >
      Play, compete, and analyze with a real-time chess platform built from scratch for the next generation of grandmasters.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
    >
      <button
        onClick={onPlayNow}
        className="w-full sm:w-auto bg-signature-gradient text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl shadow-chess-green-20 hover:scale-105 transition-transform"
      >
        Play Now
      </button>
      <button
        onClick={onSelectRival}
        className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        Play Online
      </button>
      <button className="text-chess-green font-bold px-8 py-4 hover:underline underline-offset-8">
        View Source
      </button>
    </motion.div>
  </section>
);

const Showcase = () => (
  <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800 transition-colors">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Precision in every move.</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          Experience a workspace designed for focus. From the tactical board to the real-time engine evaluation, every element is curated for high-level study.
        </p>
        <div className="flex flex-wrap gap-3">
          {["React", "TypeScript", "WebSockets", "Custom Engine", "Tailwind CSS"].map((tag) => (
            <span key={tag} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0.75, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl shadow-slate-200 dark:shadow-black/40 p-6 md:p-8 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-8 sm:aspect-[4/3]"
      >
        <div className="w-full sm:flex-1 relative">
          <div className="aspect-square bg-[#e4e4cc] rounded-xl overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.15)] border-4 border-chess-dark/80 dark:border-chess-dark relative">
            <div className="w-full h-full grid grid-cols-8 grid-rows-8">
              {Array.from({ length: 64 }).map((_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const isDark = (row + col) % 2 === 1;
                const pieces: Record<number, string> = {
                  0: '/pieces/bR.svg', 1: '/pieces/bN.svg', 2: '/pieces/bB.svg', 3: '/pieces/bQ.svg', 4: '/pieces/bK.svg', 5: '/pieces/bB.svg', 6: '/pieces/bN.svg', 7: '/pieces/bR.svg',
                  8: '/pieces/bP.svg', 9: '/pieces/bP.svg', 10: '/pieces/bP.svg', 11: '/pieces/bP.svg', 13: '/pieces/bP.svg', 14: '/pieces/bP.svg', 15: '/pieces/bP.svg',
                  18: '/pieces/bN.svg', 28: '/pieces/bP.svg', 34: '/pieces/wN.svg', 35: '/pieces/wP.svg',
                  48: '/pieces/wP.svg', 49: '/pieces/wP.svg', 50: '/pieces/wP.svg', 52: '/pieces/wP.svg', 53: '/pieces/wP.svg', 54: '/pieces/wP.svg', 55: '/pieces/wP.svg',
                  56: '/pieces/wR.svg', 57: '/pieces/wN.svg', 58: '/pieces/wB.svg', 59: '/pieces/wQ.svg', 60: '/pieces/wK.svg', 61: '/pieces/wB.svg', 63: '/pieces/wR.svg'
                };
                const piece = pieces[i];
                return (
                  <div key={i} className={`${isDark ? "bg-[#2d5a27]" : "bg-[#e4e4cc]"} flex justify-center items-center relative`}>
                    {piece && <img src={piece} alt="piece" className="w-[85%] h-[85%] object-contain drop-shadow-md z-10" />}
                    {(i === 35 || i === 51) && <div className="absolute inset-0 bg-yellow-400/40 z-0" />}
                  </div>
                );
              })}
            </div>
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] pointer-events-none" />
          </div>
        </div>

        <div className="w-full sm:w-64 flex flex-col space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl flex items-center justify-between border border-transparent dark:border-slate-800">
            <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">10:00</span>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>

          <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl flex flex-col justify-end space-y-3 border border-transparent dark:border-slate-800">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl text-xs text-slate-600 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700">
              Good luck, have fun!
            </div>
            <div className="bg-chess-green text-white p-3 rounded-xl text-xs self-end shadow-sm">
              You too!
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 italic">Type a message...</p>
            </div>
          </div>

          <div className="bg-chess-dark p-4 rounded-2xl flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-white/60" />
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-white" />
            </div>
            <span className="text-xs font-bold text-white">+1.4</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Features = () => {
  const tools = [
    {
      icon: Bolt,
      title: "Real-Time Multiplayer",
      desc: "Latency-free matchmaking powered by high-speed WebSockets for a seamless experience.",
    },
    {
      icon: Cpu,
      title: "Advanced Chess Engine",
      desc: "Integrated Stockfish analysis to help you find the winning line in any position.",
    },
    {
      icon: Lightbulb,
      title: "Smart Move Highlights",
      desc: "Subtle visual cues highlighting legal moves and tactical blunders as they happen.",
    },
    {
      icon: Timer,
      title: "Time Control Modes",
      desc: "From 1-minute Bullet to 30-minute Classical, customize every aspect of your clock.",
    },
    {
      icon: MessageSquare,
      title: "Live Chat & Invites",
      desc: "Connect with friends or challenge rivals directly through a secure messaging system.",
    },
    {
      icon: BarChart3,
      title: "Game Analysis Tools",
      desc: "Review every match with a heat map of mistakes and accuracy percentages.",
    },
  ];

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 space-y-6 md:space-y-0">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Elite Tools for Strategy.</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">We have stripped away the noise to leave you with the most powerful analysis suite in digital chess.</p>
        </div>
        <span className="text-chess-green font-bold text-sm tracking-widest uppercase">The Toolkit</span>
      </div>

      <div className="flex overflow-x-auto gap-6 sm:gap-8 pb-12 snap-x snap-mandatory hide-scroll -mx-6 px-6 sm:mx-0 sm:px-0">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.7, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex-none w-[85%] sm:w-[350px] snap-center p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all group border border-slate-200 dark:border-slate-800"
          >
            <tool.icon className="w-10 h-10 text-chess-green mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{tool.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{tool.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Process = () => (
  <section className="py-32 px-6 bg-chess-dark text-white">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">From Entry to Mastery</h2>
        <p className="text-white/60 text-lg">Simple steps to start your professional chess journey.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {[
          { step: "1", title: "Start/Join", desc: "Create a custom room or jump into the global queue." },
          { step: "2", title: "Select Piece", desc: "Tactile interaction ensures every move feels intentional." },
          { step: "3", title: "See Moves", desc: "Dynamic highlights guide your legal options instantly." },
          { step: "4", title: "Play", desc: "Execute your strategy and climb the global ranks." },
        ].map((item, i) => (
          <div key={i} className="text-center group">
            <div className="w-20 h-20 bg-chess-green rounded-full flex items-center justify-center mx-auto mb-8 text-2xl font-bold border-4 border-white/10 group-hover:scale-110 transition-transform shadow-2xl">
              {item.step}
            </div>
            <h4 className="text-xl font-bold mb-4">{item.title}</h4>
            <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTA = ({ onPlayNow, onSelectRival }: { onPlayNow: () => void; onSelectRival: () => void }) => (
  <section className="py-32 px-6 text-center max-w-4xl mx-auto">
    <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-8 leading-[1.05] sm:leading-none">
      Ready to make your move?
    </h2>
    <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-12 px-4">
      Join a community of thousands studying the art of the 64 squares.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
      <button
        onClick={onPlayNow}
        className="w-full sm:w-auto bg-signature-gradient text-white px-12 py-5 rounded-2xl text-xl font-bold shadow-2xl shadow-chess-green-20 hover:scale-105 transition-transform"
      >
        Start Playing
      </button>
      <button
        onClick={onSelectRival}
        className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-12 py-5 rounded-2xl text-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        Challenge a Friend
      </button>
    </div>
  </section>
);

export default function Home() {
  const router = useRouter();
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  const handlePlayOnline = async () => {
    setIsCreatingGame(true);
    try {
      const res = await fetch(backendUrl("/api/games"), { method: "POST" });
      const data = await res.json();
      if (data.gameId) {
        router.push(`/join/${data.gameId}`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to backend server");
    } finally {
      setIsCreatingGame(false);
    }
  };

  return (
    <>
      <Navbar onNavigate={() => {}} />
      <Hero onPlayNow={handlePlayOnline} onSelectRival={handlePlayOnline} />
      <Showcase />
      <Features />
      <Process />
      <CTA onPlayNow={handlePlayOnline} onSelectRival={handlePlayOnline} />
      <Footer />
    </>
  );
}
