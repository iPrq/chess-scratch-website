"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Bolt,
  Cpu,
  Lightbulb,
  Timer,
  MessageSquare,
  BarChart3,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import ChessBoard from "./components/ChessBoard";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

const Hero = ({ onSelectRival }: { onSelectRival: () => void }) => (
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
      className="text-6xl md:text-8xl font-extrabold tracking-tighter text-slate-900 mb-8 leading-[0.95]"
    >
      Modern Chess, <br />
      <span className="text-chess-green italic">Reimagined</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
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
        onClick={onSelectRival}
        className="w-full sm:w-auto bg-signature-gradient text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl shadow-chess-green-20 hover:scale-105 transition-transform"
      >
        Play Now
      </button>
      <button
        onClick={onSelectRival}
        className="w-full sm:w-auto bg-slate-100 text-slate-900 px-10 py-4 rounded-xl text-lg font-bold hover:bg-slate-200 transition-colors"
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
  <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">Precision in every move.</h2>
        <p className="text-lg text-slate-500 leading-relaxed">
          Experience a workspace designed for focus. From the tactical board to the real-time engine evaluation, every element is curated for high-level study.
        </p>
        <div className="flex flex-wrap gap-3">
          {["React", "TypeScript", "WebSockets", "Custom Engine", "Tailwind CSS"].map((tag) => (
            <span key={tag} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0.75, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-white rounded-3xl shadow-2xl shadow-slate-200 p-8 border border-slate-200"
      >
        <div className="flex gap-8 aspect-[4/3]">
          <div className="flex-1 aspect-square chess-grid bg-chess-light rounded-xl overflow-hidden shadow-inner">
            {Array.from({ length: 64 }).map((_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const isDark = (row + col) % 2 === 1;
              return (
                <div
                  key={i}
                  className={`${isDark ? "bg-chess-green" : "bg-chess-light"} flex items-center justify-center relative`}
                >
                  {i === 44 && (
                    <div className="w-8 h-8 bg-white/20 rounded-full blur-sm animate-pulse" />
                  )}
                  {i === 44 && (
                    <LayoutDashboard className="text-chess-light w-6 h-6 absolute" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="w-64 flex flex-col space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
              <span className="font-mono text-xl font-bold text-slate-900">10:00</span>
              <Clock className="w-5 h-5 text-slate-400" />
            </div>

            <div className="flex-1 bg-slate-50 p-4 rounded-2xl flex flex-col justify-end space-y-3">
              <div className="bg-white p-3 rounded-xl text-xs text-slate-600 shadow-sm border border-slate-100">
                Good luck, have fun!
              </div>
              <div className="bg-chess-green text-white p-3 rounded-xl text-xs self-end shadow-sm">
                You too!
              </div>
              <div className="pt-2 border-t border-slate-200">
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
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Elite Tools for Strategy.</h2>
          <p className="text-lg text-slate-500">We have stripped away the noise to leave you with the most powerful analysis suite in digital chess.</p>
        </div>
        <span className="text-chess-green font-bold text-sm tracking-widest uppercase">The Toolkit</span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.7, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-3xl bg-white hover:bg-slate-50 hover:shadow-xl hover:shadow-slate-200/50 transition-all group border border-slate-200 hover:border-slate-300"
          >
            <tool.icon className="w-10 h-10 text-chess-green mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-900 mb-4">{tool.title}</h3>
            <p className="text-slate-500 leading-relaxed">{tool.desc}</p>
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

const CTA = ({ onPlay }: { onPlay: () => void }) => (
  <section className="py-32 px-6 text-center max-w-4xl mx-auto">
    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 mb-8 leading-none">
      Ready to make your move?
    </h2>
    <p className="text-xl text-slate-500 mb-12">
      Join a community of thousands studying the art of the 64 squares.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
      <button
        onClick={onPlay}
        className="w-full sm:w-auto bg-signature-gradient text-white px-12 py-5 rounded-2xl text-xl font-bold shadow-2xl shadow-chess-green-20 hover:scale-105 transition-transform"
      >
        Start Playing
      </button>
      <button
        onClick={onPlay}
        className="w-full sm:w-auto bg-slate-100 text-slate-900 px-12 py-5 rounded-2xl text-xl font-bold hover:bg-slate-200 transition-colors"
      >
        Challenge a Friend
      </button>
    </div>
  </section>
);

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);

  const goToRivalSelection = () => {
    window.location.href = "/selection";
  };

  const handleNavigate = (view: string) => {
    if (view === "landing") {
      setIsPlaying(false);
    }
  };

  if (!isPlaying) {
    return (
      <>
        <Navbar onNavigate={handleNavigate} />
        <Hero onSelectRival={goToRivalSelection} />
        <Showcase />
        <Features />
        <Process />
        <CTA onPlay={goToRivalSelection} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar onNavigate={handleNavigate} />
      <ChessBoard />
      <Footer />
    </>
  );
}
