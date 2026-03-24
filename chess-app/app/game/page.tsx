"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Flag,
  Handshake,
  SendHorizontal,
  Timer,
  Undo2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import ChessBoard, { type ChessBoardUpdate } from "../components/ChessBoard";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import type { GameStatus } from "../../lib/chessLogic";

type Opponent = {
  name: string;
  elo: number;
  avatar: string;
  isBot: boolean;
};

type ChatMessage = {
  role: "bot" | "user";
  text: string;
  name: string;
};

const defaultOpponent: Opponent = {
  name: "Stockfish 16",
  elo: 3200,
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB3Yuk1r1sNMujX10nUWzb9aTyK9cNGPQBHd94XPVRVKiIzVtGFeRkKt8gIu6UOqmuZ5ORFfFhybMazTE8AwAsuembORvO2qRFXE7-0zOQaraA1Z0ivyMztoC-XGQcNdphST7soMvRCaQPDFddZQkB_Jg4ih18ZkcRal1VAyWOjgWm-bsENZvW6aaGMXNFvbN0w3Fx6ghyUHnoDwCHsXSOOkN4Xjax0RB-yzLCaiDQi4Eh1J7TAYHvboeTLfC_-XebmJl5XBFwfNawl",
  isBot: true,
};

const initialStatus: GameStatus = {
  whiteInCheck: false,
  blackInCheck: false,
  currentPlayerCheckmated: false,
  currentPlayerStalemated: false,
  gameOver: false,
  winner: null,
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const pairMoves = (moves: string[]): string[][] => {
  const pairs: string[][] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i], moves[i + 1] ?? ""]);
  }
  return pairs;
};

export default function GamePage() {
  const [opponent] = useState(defaultOpponent);
  const [evaluation, setEvaluation] = useState(0.82);
  const [whiteTime, setWhiteTime] = useState(374);
  const [blackTime, setBlackTime] = useState(522);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Good luck, have fun!", name: opponent.name },
    { role: "user", text: "You too. Let's see what you've got.", name: "You" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const [moveList, setMoveList] = useState<string[]>([]);
  const [turn, setTurn] = useState<"white" | "black">("white");
  const [status, setStatus] = useState<GameStatus>(initialStatus);
  const [canUndo, setCanUndo] = useState(false);
  const [undoSignal, setUndoSignal] = useState(0);

  const moveHistory = useMemo(() => pairMoves(moveList), [moveList]);

  useEffect(() => {
    if (status.gameOver) return;

    const timer = setInterval(() => {
      if (turn === "white") {
        setWhiteTime((prev) => Math.max(0, prev - 1));
      } else {
        setBlackTime((prev) => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status.gameOver, turn]);

  useEffect(() => {
    if (moveList.length === 0) return;

    setEvaluation((prev) => {
      const nextEval = prev + (Math.random() - 0.5) * 0.5;
      return Math.max(-4, Math.min(4, Number(nextEval.toFixed(2))));
    });
  }, [moveList.length]);

  const handleGameUpdate = (update: ChessBoardUpdate) => {
    setMoveList(update.moveList);
    setTurn(update.turn);
    setStatus(update.status);
    setCanUndo(update.canUndo);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: inputMessage, name: "You" }]);
    setInputMessage("");
  };

  return (
    <>
      <Navbar
        onNavigate={(view) => {
          if (view === "landing") {
            window.location.href = "/";
          }
        }}
      />

      <div className="bg-[#f8faf4] min-h-screen font-sans text-[#191c19] w-full">
        <main className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12 grid grid-cols-12 gap-8 lg:gap-12">
          <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            <section className="bg-[#f3f4ef] rounded-2xl p-6 shadow-sm border border-[#c2c9bb]/20">
              <h3 className="font-bold text-lg mb-4 text-[#154212]">Engine Evaluation</h3>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-black tracking-tighter text-[#191c19]">
                  {evaluation > 0 ? `+${evaluation.toFixed(2)}` : evaluation.toFixed(2)}
                </span>
                <span className="text-xs uppercase tracking-widest text-[#72796e] font-bold">
                  {evaluation > 0 ? "White is slightly better" : "Black is slightly better"}
                </span>
              </div>
              <div className="w-full h-2 bg-[#e1e3de] rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-[#154212] transition-all duration-500"
                  style={{ width: `${Math.max(5, Math.min(95, 50 + evaluation * 10))}%` }}
                />
                <div className="h-full bg-[#c2c9bb] flex-1" />
              </div>
            </section>

            <section className="bg-[#f3f4ef] rounded-2xl p-6 flex-1 flex flex-col min-h-[360px] shadow-sm border border-[#c2c9bb]/20">
              <h3 className="font-bold text-lg mb-4 text-[#154212]">Table Talk</h3>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : ""}`}>
                    <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[#72796e]">{msg.name}</span>
                    <div
                      className={`p-3 rounded-xl text-sm shadow-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-[#154212] to-[#2d5a27] text-white rounded-tr-none"
                          : "bg-[#e1e3de] text-[#191c19] rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative">
                <input
                  className="w-full bg-[#e1e3de] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#154212]/20 transition-all outline-none"
                  placeholder="Type a message..."
                  type="text"
                  value={inputMessage}
                  onChange={(event) => setInputMessage(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#154212] hover:scale-110 transition-transform"
                  aria-label="Send message"
                >
                  <SendHorizontal className="w-4 h-4" />
                </button>
              </div>
            </section>
          </aside>

          <section className="col-span-12 lg:col-span-6 flex flex-col items-center gap-8">
            <div className="w-full flex justify-between items-center bg-[#f3f4ef] p-4 rounded-2xl shadow-sm border border-[#c2c9bb]/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e1e3de] flex items-center justify-center overflow-hidden border border-[#c2c9bb]/30">
                  <img alt={opponent.name} src={opponent.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#191c19]">{opponent.name}</span>
                    {opponent.isBot && (
                      <span className="bg-[#42493e]/10 px-2 py-0.5 rounded text-[10px] font-bold text-[#42493e] uppercase">BOT</span>
                    )}
                  </div>
                  <span className="text-xs text-[#72796e] font-medium tracking-wide">ELO: {opponent.elo}</span>
                </div>
              </div>
              <div className="bg-[#e1e3de] px-6 py-3 rounded-xl flex items-center gap-3">
                <Timer className="w-5 h-5 text-[#42493e]" />
                <span className="font-mono text-2xl font-bold text-[#191c19] tabular-nums">{formatTime(blackTime)}</span>
              </div>
            </div>

            <div className="relative aspect-square w-full max-w-[600px] bg-[#e7e9e3] p-4 rounded-2xl shadow-2xl shadow-[#191c19]/10 border border-[#c2c9bb]/30">
              <ChessBoard onGameUpdate={handleGameUpdate} undoSignal={undoSignal} />
            </div>

            <div className="w-full flex justify-between items-center bg-[#f3f4ef] p-4 rounded-2xl shadow-sm border border-[#c2c9bb]/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e1e3de] overflow-hidden border border-[#c2c9bb]/30">
                  <img
                    alt="User Profile"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKNzbGbQEV16h2HeJJYFvuAv5FAW8IKUURz-4kEU0iy_XibTQCt1WC-cUy_7oeLKWHItyJusWf6yL5l1MvMyK-wqQdj9UJ_-6RqD-Zg6Zk1f539g8gLSF_Uz1kiFh6xXQU3pDajF75R79Ax_a7MN3RqR0HYmjfusKgI6-lvEUstsHqja2HGHb1Fth8cF0YSKWtHDVOvUtILCTgT79SijVbIUZHG6PcCGchTHPcwRxGrCvNNNVJd1Dvg8s7UjnsRPMdPG1qobmWleDf"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="font-bold text-[#191c19]">Grandmaster Study</span>
                  <div className="text-xs text-[#72796e] font-medium tracking-wide">ELO: 2450</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#154212] to-[#2d5a27] px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg shadow-[#154212]/20">
                <Timer className="w-5 h-5 text-white" />
                <span className="font-mono text-2xl font-bold text-white tabular-nums">{formatTime(whiteTime)}</span>
              </div>
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            <section className="bg-[#f3f4ef] rounded-2xl flex flex-col h-[500px] shadow-sm border border-[#c2c9bb]/20 overflow-hidden">
              <div className="p-6 pb-2">
                <h3 className="font-bold text-lg text-[#154212]">Move History</h3>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="grid grid-cols-1 gap-1">
                  {moveHistory.length === 0 ? (
                    <div className="text-center py-8 text-[#72796e] text-sm italic">No moves yet</div>
                  ) : (
                    moveHistory.map((pair, idx) => (
                      <div key={idx} className="grid grid-cols-5 py-2 px-3 bg-white rounded-lg mb-1 items-center shadow-sm border border-[#c2c9bb]/10">
                        <span className="col-span-1 text-xs font-bold text-[#393a29] opacity-50">{idx + 1}.</span>
                        <span className="col-span-2 text-sm font-medium text-[#191c19]">{pair[0]}</span>
                        <span className="col-span-2 text-sm font-medium text-[#191c19]">{pair[1]}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="p-4 bg-[#e7e9e3] flex justify-center gap-4 border-t border-[#c2c9bb]/20">
                <button className="text-[#42493e] hover:text-[#154212] transition-colors" aria-label="First"><ChevronsLeft className="w-5 h-5" /></button>
                <button className="text-[#42493e] hover:text-[#154212] transition-colors" aria-label="Previous"><ChevronLeft className="w-5 h-5" /></button>
                <button className="text-[#42493e] hover:text-[#154212] transition-colors" aria-label="Next"><ChevronRight className="w-5 h-5" /></button>
                <button className="text-[#42493e] hover:text-[#154212] transition-colors" aria-label="Last"><ChevronsRight className="w-5 h-5" /></button>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setUndoSignal((prev) => prev + 1)}
                disabled={!canUndo}
                className="bg-[#f3f4ef] hover:bg-[#e7e9e3] disabled:opacity-50 text-[#191c19] font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-sm border border-[#c2c9bb]/20"
              >
                <Undo2 className="w-5 h-5" />
                Request Undo
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-[#f3f4ef] hover:bg-[#e7e9e3] text-[#191c19] font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm border border-[#c2c9bb]/20">
                  <Handshake className="w-5 h-5" />
                  Draw
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  className="bg-[#ffdad6]/20 hover:bg-[#ffdad6]/40 text-[#ba1a1a] font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm border border-[#ba1a1a]/10"
                >
                  <Flag className="w-5 h-5" />
                  Resign
                </button>
              </div>
            </section>

            {(status.currentPlayerCheckmated || status.currentPlayerStalemated || status.whiteInCheck || status.blackInCheck || status.gameOver) && (
              <section className="bg-white rounded-2xl p-4 border border-slate-200 text-sm">
                {status.currentPlayerCheckmated && <p className="font-bold text-red-700">Checkmate! {status.winner === "white" ? "White" : "Black"} wins.</p>}
                {status.currentPlayerStalemated && <p className="font-bold text-indigo-700">Stalemate! Draw.</p>}
                {!status.currentPlayerCheckmated && !status.currentPlayerStalemated && (status.whiteInCheck || status.blackInCheck) && (
                  <p className="font-semibold text-red-700">{status.whiteInCheck ? "White" : "Black"} king is in check.</p>
                )}
                <p className="mt-2 text-slate-500">Turn: {turn}</p>
              </section>
            )}
          </aside>
        </main>
      </div>

      <Footer />
    </>
  );
}
