"use client";

import { useState } from "react";
import { JSX } from "react";
import {
  createInitialGameState,
  handleSquareClick,
  type GameState,
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

  return `pieces/${color}${typeMap[piece.type]}.svg`;
};

export default function ChessBoard(): JSX.Element {
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());

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
    setGameState((prev) => handleSquareClick(prev, row, col));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {currentPlayerCheckmated && (
        <div style={{ backgroundColor: "#ffe1e1", color: "#8b0000", border: "1px solid #ff8a8a", padding: "8px 10px", width: "480px", fontWeight: 700 }}>
          Checkmate! {winner === "white" ? "White" : "Black"} wins.
        </div>
      )}

      {currentPlayerStalemated && (
        <div style={{ backgroundColor: "#eef2ff", color: "#1f2a44", border: "1px solid #b8c4ff", padding: "8px 10px", width: "480px", fontWeight: 700 }}>
          Stalemate! Draw.
        </div>
      )}

      {!currentPlayerCheckmated && !currentPlayerStalemated && (whiteInCheck || blackInCheck) && (
        <div
          style={{
            backgroundColor: "#ffe1e1",
            color: "#8b0000",
            border: "1px solid #ff8a8a",
            padding: "8px 10px",
            width: "480px",
            fontWeight: 600,
          }}
        >
          {whiteInCheck && "White king is in check! "}
          {blackInCheck && "Black king is in check!"}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 60px)",
          border: "2px solid black",
          width: "480px",
        }}
      >
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
                style={{
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isSelected
                    ? "yellow"
                    : isDark
                    ? "#769656"
                    : "#eeeed2",
                  boxShadow: isCheckedKing ? "inset 0 0 0 4px #d10000" : "none",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {showMoveDot && (
                  <span
                    style={{
                      position: "absolute",
                      width: piece ? "18px" : "14px",
                      height: piece ? "18px" : "14px",
                      borderRadius: "50%",
                      backgroundColor: "black",
                      opacity: piece ? 0.45 : 0.7,
                      zIndex: 2,
                    }}
                  />
                )}

                {piece && (
                  <img
                    src={getPieceImage(piece)}
                    alt="piece"
                    width={50}
                    height={50}
                    style={{ position: "relative", zIndex: 1 }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      <div style={{
        backgroundColor: gameOver ? "red" : "white",
        color: gameOver ? "white" : "black",
        border: gameOver ? "1px solid red" : "1px solid black",
        padding: "8px 10px",
        width: "480px",
        fontWeight: 600,
      }}
      >
        {gameOver && "Game Over!"}
        {!gameOver && "Game in progress... "}
      </div>
    </div>
  );
}