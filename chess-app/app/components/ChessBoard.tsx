"use client";

import { useState, useMemo } from "react";
import { JSX } from "react";
import { useChessGame } from "../../lib/useChessGame";
import { LayoutDashboard } from "lucide-react";
import { getLegalMoves } from "../../lib/chessLogic";

const getPieceImage = (piece: any): string => {
  const color = piece.color.toLowerCase() === "white" ? "w" : "b";
  const typeMap: Record<string, string> = {
    pawn: "P",
    rook: "R",
    knight: "N",
    bishop: "B",
    queen: "Q",
    king: "K",
  };
  return `/pieces/${color}${typeMap[piece.type.toLowerCase()]}.svg`;
};

type ChessBoardProps = {
  gameId: string;
  playerColor: string | null;
  backendGame: any;
  error: string | null;
  makeMove: (fromRow: number, fromCol: number, toRow: number, toCol: number, promotionPiece?: string) => void;
};

export default function ChessBoard({ gameId, playerColor, backendGame, error, makeMove }: ChessBoardProps): JSX.Element {
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [promotionPending, setPromotionPending] = useState<{ fromRow: number, fromCol: number, toRow: number, toCol: number } | null>(null);

  const normalizedBoard = useMemo(() => {
    if (!backendGame?.board) return [];
    return backendGame.board.map((rowArr: any[]) => 
      rowArr.map((p: any) => 
        p ? { ...p, type: p.type.toLowerCase(), color: p.color.toLowerCase() } : null
      )
    );
  }, [backendGame]);

  const localLegalMoves = useMemo(() => {
    if (!selected || !normalizedBoard.length || !backendGame) return [];
    const [r, c] = selected;
    const piece = normalizedBoard[r]?.[c];
    if (!piece) return [];
    
    return getLegalMoves(normalizedBoard, piece, r, c, backendGame.hasMoved || undefined, backendGame.lastMove || undefined);
  }, [selected, normalizedBoard, backendGame]);

  if (error) {
    return (
      <div className="w-full flex items-center justify-center aspect-square bg-slate-50 border border-red-200 rounded-xl">
        <div className="text-red-500 font-bold p-4 text-center">Connection Error: {error}</div>
      </div>
    );
  }

  if (!backendGame) {
    return (
      <div className="w-full flex items-center justify-center aspect-square bg-slate-50 border border-slate-200 rounded-xl">
        <div className="text-slate-500 p-4 text-center text-xl font-bold animate-pulse flex flex-col items-center">
          <LayoutDashboard className="w-10 h-10 mb-4 text-chess-green animate-spin" />
          Connecting to server...
        </div>
      </div>
    );
  }

  const {
    board,
    turn,
    status,
    hasMoved,
    lastMove
  } = backendGame;

  // Fallbacks if backend doesn't provide these keys in identical format
  const gameOver = status?.gameOver || false;
  const whiteInCheck = status?.whiteInCheck || false;
  const blackInCheck = status?.blackInCheck || false;
  const currentPlayerCheckmated = status?.currentPlayerCheckmated || false;
  const currentPlayerStalemated = status?.currentPlayerStalemated || false;
  const winner = status?.winner || null;

  const handleClick = (row: number, col: number) => {
    if (gameOver) return;

    // Only allow moves if it's our turn
    if (playerColor?.toUpperCase() !== turn?.toUpperCase()) {
      return; 
    }

    if (!selected) {
      // Select a piece if it belongs to the player
      const piece = board[row][col];
      if (piece && piece.color.toUpperCase() === playerColor?.toUpperCase()) {
        setSelected([row, col]);
      }
    } else {
      // If we click the same square, deselect
      if (selected[0] === row && selected[1] === col) {
        setSelected(null);
      } else {
        const isLegal = localLegalMoves.some(([lr, lc]) => lr === row && lc === col);
        if (!isLegal) {
          setSelected(null);
          return;
        }

        // Attempt move
        const piece = board[selected[0]][selected[1]];
        if (piece && piece.type.toLowerCase() === "pawn" && (row === 0 || row === 7)) {
          setPromotionPending({ fromRow: selected[0], fromCol: selected[1], toRow: row, toCol: col });
          setSelected(null);
          return;
        }

        makeMove(selected[0], selected[1], row, col);
        setSelected(null);
      }
    }
  };

  const isPlayerTurn = playerColor?.toUpperCase() === turn?.toUpperCase();

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold text-slate-900">Room: {gameId}</h2>
        <div className="flex items-center space-x-2">
           <span className="text-sm font-semibold uppercase text-slate-500 tracking-wider">You are: {playerColor}</span>
           <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase ${isPlayerTurn ? "bg-chess-green text-white shadow-lg shadow-chess-green-20" : "bg-slate-200 text-slate-500"}`}>
             {isPlayerTurn ? "Your Turn" : "Opponent's Turn"}
           </div>
        </div>
      </div>

      {currentPlayerCheckmated && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 shadow-sm">
          Checkmate! {winner?.toLowerCase() === "white" ? "White" : "Black"} wins.
        </div>
      )}

      {currentPlayerStalemated && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 shadow-sm">
          Stalemate! Draw.
        </div>
      )}

      {!currentPlayerCheckmated && !currentPlayerStalemated && (whiteInCheck || blackInCheck) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm">
          {whiteInCheck && "White king is in check! "}
          {blackInCheck && "Black king is in check!"}
        </div>
      )}

      <div className="relative grid w-full aspect-square grid-cols-8 overflow-hidden rounded-[4px] shadow-2xl bg-chess-bg border-4 border-chess-green/30 dark:border-chess-dark/80">
        {board.map((rowArr: any[], row: number) =>
          rowArr.map((piece: any, col: number) => {
            const isDark = (row + col) % 2 === 1;

            const isSelected =
              selected?.[0] === row && selected?.[1] === col;
            
            const isLastMove = lastMove && lastMove.from && lastMove.to && (
              (lastMove.from[0] === row && lastMove.from[1] === col) || 
              (lastMove.to[0] === row && lastMove.to[1] === col)
            );

            const isCheckedKing =
              piece?.type?.toLowerCase() === "king" &&
              ((piece.color.toLowerCase() === "white" && whiteInCheck) ||
                (piece.color.toLowerCase() === "black" && blackInCheck));

            const isLegalMove = selected && localLegalMoves.some(([lr, lc]) => lr === row && lc === col);

            return (
              <div
                key={`${row}-${col}`}
                onClick={() => handleClick(row, col)}
                className="relative aspect-square cursor-pointer select-none flex items-center justify-center transition-all bg-chess-bg"
                style={{ 
                  boxShadow: isCheckedKing ? "inset 0 0 0 4px #dc2626" : isSelected ? "inset 0 0 0 6px var(--color-chess-green)" : "none",
                  backgroundColor: isDark ? "var(--color-chess-green)" : "var(--color-chess-light)" 
                }}
              >
                {piece && (
                  <img
                    src={getPieceImage(piece)}
                    alt="piece"
                    width={90}
                    height={90}
                    className="relative z-20 h-[90%] w-[90%] object-contain drop-shadow-md"
                  />
                )}
                {isLegalMove && (
                  <div className="absolute w-[25%] h-[25%] bg-black/40 rounded-full z-10 pointer-events-none" />
                )}
                {isLastMove && !isSelected && (
                  <div className="absolute inset-0 bg-[#eab308]/40 z-10 pointer-events-none" />
                )}
              </div>
            );
          })
        )}
        
        {promotionPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 rounded-[4px] backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
              <h3 className="text-xl font-bold text-slate-800">Choose Promotion</h3>
              <div className="flex gap-4">
                {["queen", "knight", "rook", "bishop"].map(p => (
                  <div key={p} 
                       className="cursor-pointer hover:bg-slate-100 bg-slate-50 border-2 border-slate-200 hover:border-chess-green p-3 rounded-xl transition-all"
                       onClick={(e) => {
                           e.stopPropagation();
                           makeMove(promotionPending.fromRow, promotionPending.fromCol, promotionPending.toRow, promotionPending.toCol, p);
                           setPromotionPending(null);
                       }}>
                    <img src={getPieceImage({ type: p, color: playerColor || "white" })} className="w-16 h-16 object-contain drop-shadow-sm" alt={p}/>
                  </div>
                ))}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setPromotionPending(null); }}
                className="mt-2 text-sm text-slate-500 hover:text-slate-800 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {gameOver && (
        <div className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm text-center">
          Game Over. Thanks for playing!
        </div>
      )}
    </div>
  );
}