"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Flag, Handshake } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import ChessBoard from "../../components/ChessBoard";
import ChatBox from "../../components/ChatBox";
import MoveHistory from "../../components/MoveHistory";
import { useChessGame } from "../../../lib/useChessGame";

export default function GameRoom({ params }: { params: Promise<{ gameId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const gameId = resolvedParams.gameId;

  const { playerColor, backendGame, error, makeMove, sendChatMessage, sendAction } = useChessGame(gameId);

  const opponentColor = playerColor?.toLowerCase() === "white" ? "Black" : "White";
  const status = backendGame?.status;

  // Derive evaluation for aesthetic purposes since Engine eval isn't on backend yet!
  const evalNumber = backendGame?.turn === "WHITE" ? "+0.45" : "-0.15"; 
  const evalColor = backendGame?.turn === "WHITE" ? "bg-[#154212]" : "bg-[#191c19]";

  return (
    <div className="bg-[#f8faf4] min-h-screen font-inter text-[#191c19] flex flex-col w-full">
      <Navbar onNavigate={(view) => {
          if (view === "landing") {
            window.location.href = "/";
          }
        }} />
        
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12 grid grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Evaluation & Chat */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <section className="bg-[#f3f4ef] rounded-2xl p-6 shadow-[0_2px_8px_rgba(25,28,25,0.04)] border border/transparent">
            <h3 className="font-manrope font-bold text-lg mb-4 text-[#154212]">Engine Evaluation</h3>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-black tracking-tighter text-[#191c19]">{evalNumber}</span>
              <span className="text-xs uppercase tracking-widest text-[#72796e] font-bold">Analysis Running</span>
            </div>
            <div className="w-full h-2 bg-[#e1e3de] rounded-full overflow-hidden flex">
              <div className={`h-full ${evalColor} transition-all duration-500 w-[55%]`} />
              <div className="h-full bg-[#c2c9bb] flex-1" />
            </div>
          </section>

          <ChatBox 
            chatMessages={backendGame?.chatMessages || []} 
            sendChatMessage={sendChatMessage} 
            playerColor={playerColor}
          />
        </aside>

        {/* Center Column: Profiles, Timers, Chessboard */}
        <section className="col-span-12 lg:col-span-6 flex flex-col items-center gap-8">
          <div className="w-full flex justify-between items-center bg-[#f3f4ef] p-4 rounded-2xl shadow-[0_2px_8px_rgba(25,28,25,0.04)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e1e3de] flex items-center justify-center overflow-hidden border border-[#c2c9bb]/30">
                <img alt="Opponent" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3Yuk1r1sNMujX10nUWzb9aTyK9cNGPQBHd94XPVRVKiIzVtGFeRkKt8gIu6UOqmuZ5ORFfFhybMazTE8AwAsuembORvO2qRFXE7-0zOQaraA1Z0ivyMztoC-XGQcNdphST7soMvRCaQPDFddZQkB_Jg4ih18ZkcRal1VAyWOjgWm-bsENZvW6aaGMXNFvbN0w3Fx6ghyUHnoDwCHsXSOOkN4Xjax0RB-yzLCaiDQi4Eh1J7TAYHvboeTLfC_-XebmJl5XBFwfNawl" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#191c19] text-lg">Anonymous Rival</span>
                  <span className="bg-[#42493e]/10 px-2 py-0.5 rounded text-[10px] font-bold text-[#42493e] uppercase">{opponentColor}</span>
                </div>
                <span className="text-xs text-[#72796e] font-medium tracking-wide">ELO: 1542</span>
              </div>
            </div>
          </div>

          <div className="w-full relative max-w-[650px]">
            <ChessBoard 
               playerColor={playerColor} 
               backendGame={backendGame} 
               error={error} 
               makeMove={makeMove} 
               gameId={gameId}
            />
          </div>

          <div className="w-full flex justify-between items-center bg-[#f3f4ef] p-4 rounded-2xl shadow-[0_2px_8px_rgba(25,28,25,0.04)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e1e3de] overflow-hidden border border-[#c2c9bb]/30">
                <img alt="You" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKNzbGbQEV16h2HeJJYFvuAv5FAW8IKUURz-4kEU0iy_XibTQCt1WC-cUy_7oeLKWHItyJusWf6yL5l1MvMyK-wqQdj9UJ_-6RqD-Zg6Zk1f539g8gLSF_Uz1kiFh6xXQU3pDajF75R79Ax_a7MN3RqR0HYmjfusKgI6-lvEUstsHqja2HGHb1Fth8cF0YSKWtHDVOvUtILCTgT79SijVbIUZHG6PcCGchTHPcwRxGrCvNNNVJd1Dvg8s7UjnsRPMdPG1qobmWleDf" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-bold text-[#191c19] text-lg">You</span>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-[#72796e] font-medium tracking-wide">ELO: 1520</div>
                  <span className="bg-[#154212]/10 px-2 py-0.5 rounded text-[10px] font-bold text-[#154212] uppercase">{playerColor || "Spectator"}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#191c19] px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg shadow-[#191c19]/20">
              <span className="font-mono text-2xl font-bold text-white tabular-nums tracking-wider uppercase text-sm">Room {gameId}</span>
            </div>
          </div>
        </section>

        {/* Right Column: Move History and Controls */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <MoveHistory moveHistory={backendGame?.moveHistory || []} />

          <section className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => sendAction("OFFER_DRAW")}
                disabled={status?.gameOver}
                className="bg-[#ffffff] hover:bg-[#f8faf4] disabled:opacity-50 text-[#191c19] font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(25,28,25,0.03)] border-transparent">
                <Handshake className="w-5 h-5" />
                Offer Draw
              </button>
              <button
                onClick={() => sendAction("RESIGN")}
                disabled={status?.gameOver}
                className="bg-[#ffdad6]/20 hover:bg-[#ffdad6]/40 disabled:opacity-50 text-[#ba1a1a] font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Flag className="w-5 h-5" />
                Resign
              </button>
            </div>
          </section>

          {status && (status.currentPlayerCheckmated || status.currentPlayerStalemated || status.whiteInCheck || status.blackInCheck || status.gameOver || status.drawOfferedByColor) && (
            <section className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(25,28,25,0.03)] text-sm font-medium">
              {status.gameOver && status.winner && <p className="font-bold text-xl text-[#154212] mb-2 font-manrope tracking-tight">{status.winner} WINS!</p>}
              {status.gameOver && status.isDraw && <p className="font-bold text-xl text-[#191c19] mb-2 font-manrope tracking-tight">GAME OVER - A DRAW.</p>}
              {status.currentPlayerStalemated && <p className="font-bold text-xl text-[#191c19] mb-2 font-manrope tracking-tight">STALEMATE - A DRAW.</p>}
              {!status.gameOver && !status.currentPlayerStalemated && (status.whiteInCheck || status.blackInCheck) && (
                <p className="font-bold text-[#ba1a1a] mb-2 text-lg tracking-tight font-manrope">{status.whiteInCheck ? "WHITE" : "BLACK"} King is in Check!</p>
              )}
              {!status.gameOver && status.drawOfferedByColor && status.drawOfferedByColor.toUpperCase() !== playerColor?.toUpperCase() && (
                <div className="flex flex-col gap-3 mt-4">
                  <p className="text-[#154212] font-semibold text-lg font-manrope tracking-tight">The opponent offers a draw.</p>
                  <div className="flex gap-2">
                    <button onClick={() => sendAction("ACCEPT_DRAW")} className="flex-1 bg-signature-gradient text-white py-3 rounded-xl font-bold shadow-lg shadow-[#154212]/20">Accept</button>
                    <button onClick={() => sendAction("DECLINE_DRAW")} className="flex-1 bg-[#e1e3de] text-[#191c19] py-3 rounded-xl font-bold">Decline</button>
                  </div>
                </div>
              )}
              {!status.gameOver && status.drawOfferedByColor && status.drawOfferedByColor.toUpperCase() === playerColor?.toUpperCase() && (
                <p className="text-[#72796e] mt-2 italic">Awaiting opponent's response to draw offer...</p>
              )}
              <p className="mt-4 pt-4 border-t border-[#f3f4ef] text-[#393a29] font-bold tracking-[0.2em] uppercase text-[10px]">
                Turn: {backendGame?.turn}
              </p>
            </section>
          )}
        </aside>
      </main>
      <Footer />
    </div>
  );
}
