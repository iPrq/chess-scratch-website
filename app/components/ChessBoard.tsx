"use client";

import { useState } from "react";
import { JSX } from "react";


type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

type Color = "white" | "black";

type Piece = {
  type: PieceType;
  color: Color;
};

type Board = Piece[][];

const createpawnrow = (color: Color): Piece[] => Array.from({ length: 8 }, () => ({ type: "pawn", color }));

const initialBoard: Board = [
    [
        { type: "rook", color: "black" },
        { type: "knight", color: "black" },
        { type: "bishop", color: "black" },
        { type: "queen", color: "black" },
        { type: "king", color: "black" },
        { type: "bishop", color: "black" },
        { type: "knight", color: "black" },
        { type: "rook", color: "black" },
    ],
    createpawnrow("black"),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    createpawnrow("white"),
    [
        { type: "rook", color: "white" },
        { type: "knight", color: "white" },
        { type: "bishop", color: "white" },
        { type: "queen", color: "white" },
        { type: "king", color: "white" },
        { type: "bishop", color: "white" },
        { type: "knight", color: "white" },
        { type: "rook", color: "white" },
    ]
]

const piecemap: Record<string, string> = {
    pawn_white: "♙",
    rook_white: "♖",
    knight_white: "♘",
    bishop_white: "♗",
    queen_white: "♕",
    king_white: "♔",

    pawn_black: "♟",
    rook_black: "♜",
    knight_black: "♞",
    bishop_black: "♝",
    queen_black: "♛",
    king_black: "♚",
};


export default function ChessBoard(): JSX.Element {
  const [board, setBoard] = useState<Board>(initialBoard);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 60px)",
        border: "2px solid black",
      }}
    >
      {board.map((rowArr, row) =>
        rowArr.map((piece, col) => {
          const isDark = (row + col) % 2 === 1;

          return (
            <div
              key={`${row}-${col}`}
              onClick={() => console.log(row, col, piece)}
              style={{
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                cursor: "pointer",
                backgroundColor: isDark ? "#769656" : "#eeeed2",
              }}
            >
              {piece
                ? piecemap[`${piece.type}_${piece.color}`]
                : ""}
            </div>
          );
        })
      )}
    </div>
  );
}