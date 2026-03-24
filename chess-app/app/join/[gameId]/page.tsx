"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useChessGame } from "../../../lib/useChessGame";

export default function JoinLobby({ params }: { params: Promise<{ gameId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const gameId = resolvedParams.gameId;

  const [copied, setCopied] = useState(false);

  const { backendGame, connected, error, playerColor } = useChessGame(gameId);

  // When a second player joins, the backend game players array will be >= 2
  useEffect(() => {
    if (backendGame && backendGame.players && backendGame.players.length === 2) {
      // Both players are here, let's navigate to the actual game board!
      router.push(`/game/${gameId}`);
    }
  }, [backendGame, gameId, router]);

  const copyLink = () => {
    const link = `${window.location.origin}/join/${gameId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onNavigate={() => router.push("/")} />
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-20 text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900 mb-6">
          Game Lobby
        </h1>
        
        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 font-semibold">
            {error}
          </div>
        ) : (
          <>
            <p className="text-lg text-slate-500 mb-10">
              Waiting for an opponent to join. Share the link below to invite someone.
            </p>

            <div className="flex items-center space-x-3 w-full max-w-md bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-sm mb-12">
              <input 
                readOnly
                value={typeof window !== "undefined" ? `${window.location.origin}/join/${gameId}` : ""}
                className="flex-1 bg-transparent px-4 py-2 text-slate-700 outline-none"
              />
              <button 
                onClick={copyLink}
                className="bg-chess-dark text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            <div className="flex space-x-4 items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-chess-green animate-pulse" />
              <span className="text-slate-600 font-semibold">
                {connected ? "Connected to Server. Waiting for opponent..." : "Connecting to server..."}
              </span>
            </div>
            {playerColor && (
              <p className="mt-4 text-sm text-slate-500 font-medium">
                You will play as: <strong className="uppercase text-slate-900">{playerColor}</strong>
              </p>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
