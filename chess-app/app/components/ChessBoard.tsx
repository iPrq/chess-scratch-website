"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { JSX } from "react";
import {
  createInitialGameState,
  handleSquareClick,
  type Color,
  type GameState,
  type GameStatus,
  type Piece,
  type PieceType,
} from "../../lib/chessLogic";

const getPieceImage = (piece: Piece): string => {
  const color = piece.color === "white" ? "w" : "b";

  const typeMap: Record<PieceType, string> = {
    pawn: "p",
    rook: "r",
    knight: "n",
    bishop: "b",
    queen: "q",
    king: "k",
  };

  return `/pieces/${color}${typeMap[piece.type]}.svg`;
};

type ChessBoardProps = {
  onGameUpdate?: (update: ChessBoardUpdate) => void;
  undoSignal?: number;
};

export type ChessBoardUpdate = {
  moveList: string[];
  turn: Color;
  status: GameStatus;
  canUndo: boolean;
};

const toSquareNotation = (row: number, col: number): string => {
  const file = String.fromCharCode(97 + col);
  const rank = String(8 - row);
  return `${file}${rank}`;
};

export default function ChessBoard({ onGameUpdate, undoSignal = 0 }: ChessBoardProps): JSX.Element {
  const [history, setHistory] = useState<GameState[]>(() => [createInitialGameState()]);
  const lastUndoSignalRef = useRef(undoSignal);

  const gameState = history[history.length - 1];

  const moveList = useMemo(() => {
    if (history.length <= 1) {
      return [];
    }

    const moves: string[] = [];

    for (let i = 1; i < history.length; i += 1) {
      const move = history[i].lastMove;
      if (!move) {
        continue;
      }

      const from = toSquareNotation(move.from[0], move.from[1]);
      const to = toSquareNotation(move.to[0], move.to[1]);
      moves.push(`${from}-${to}`);
    }

    return moves;
  }, [history]);

  const {
    board,
    selected,
    validMoves,
    turn,
    status: {
      whiteInCheck,
      blackInCheck,
      currentPlayerCheckmated,
      currentPlayerStalemated,
      gameOver,
      winner,
    },
  } = gameState;

  const handleClick = (row: number, col: number) => {
    setHistory((prev) => {
      const current = prev[prev.length - 1];
      const next = handleSquareClick(current, row, col);

      if (next === current) {
        return prev;
      }

      return [...prev, next];
    });
  };

  useEffect(() => {
    if (!onGameUpdate) {
      return;
    }

    onGameUpdate({
      moveList,
      turn,
      status: gameState.status,
      canUndo: history.length > 1 && !gameOver,
    });
  }, [gameOver, gameState.status, history.length, moveList, onGameUpdate, turn]);

  useEffect(() => {
    if (undoSignal <= lastUndoSignalRef.current) {
      return;
    }

    lastUndoSignalRef.current = undoSignal;

    setHistory((prev) => {
      if (prev.length <= 1 || gameOver) {
        return prev;
      }

      return prev.slice(0, -1);
    });
  }, [gameOver, undoSignal]);

  return (
    <div className="w-full flex flex-col gap-3">
      {currentPlayerCheckmated && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
          Checkmate! {winner === "white" ? "White" : "Black"} wins.
        </div>
      )}

      {currentPlayerStalemated && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700">
          Stalemate! Draw.
        </div>
      )}

      {!currentPlayerCheckmated && !currentPlayerStalemated && (whiteInCheck || blackInCheck) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {whiteInCheck && "White king is in check! "}
          {blackInCheck && "Black king is in check!"}
        </div>
      )}

      <div className="grid w-full aspect-square grid-cols-8 overflow-hidden rounded-xl border border-[#c2c9bb]/40 shadow-inner bg-[#e1e3de]">
        {board.map((rowArr, row) =>
          rowArr.map((piece, col) => {
            const isDark = (row + col) % 2 === 1;

            const isSelected =
              selected?.[0] === row && selected?.[1] === col;

            const showMoveDot = validMoves.some(
              ([r, c]) => r === row && c === col
            );

            const isCheckedKing =
              piece?.type === "king" &&
              ((piece.color === "white" && whiteInCheck) ||
                (piece.color === "black" && blackInCheck));

            return (
              <div
                key={`${row}-${col}`}
                onClick={() => handleClick(row, col)}
                className={`relative aspect-square cursor-pointer select-none flex items-center justify-center transition-colors ${
                  isSelected ? "bg-[#a7bca4]" : isDark ? "bg-chess-green" : "bg-chess-light"
                }`}
                style={{ boxShadow: isCheckedKing ? "inset 0 0 0 3px #b91c1c" : "none" }}
              >
                {showMoveDot && (
                  <span
                    className={`absolute rounded-full bg-black/60 z-10 ${piece ? "w-[28%] h-[28%]" : "w-[20%] h-[20%]"}`}
                  />
                )}

                {piece && (
                  <img
                    src={getPieceImage(piece)}
                    alt="piece"
                    width={90}
                    height={90}
                    className="relative z-20 h-[90%] w-[90%] object-contain"
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {gameOver && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          Game Over!
        </div>
      )}
    </div>
  );
}