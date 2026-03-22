"use client";

import { useState } from "react";
import { JSX } from "react";

type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
type Color = "white" | "black";

type Piece = {
  type: PieceType;
  color: Color;
};

type Square = Piece | null;
type Board = Square[][];


const createPawnRow = (color: Color): Piece[] =>
  Array.from({ length: 8 }, () => ({ type: "pawn", color }));

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
  createPawnRow("black"),
  Array.from({ length: 8 }, () => null),
  Array.from({ length: 8 }, () => null),
  Array.from({ length: 8 }, () => null),
  Array.from({ length: 8 }, () => null),
  createPawnRow("white"),
  [
    { type: "rook", color: "white" },
    { type: "knight", color: "white" },
    { type: "bishop", color: "white" },
    { type: "queen", color: "white" },
    { type: "king", color: "white" },
    { type: "bishop", color: "white" },
    { type: "knight", color: "white" },
    { type: "rook", color: "white" },
  ],
];

const toChessNotation = (row: number, col: number): string => {
  const file = String.fromCharCode(97 + col);
  const rank = 8 - row;
  return `${file}${rank}`;
};

export default function ChessBoard(): JSX.Element {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const handleClick = (row: number, col: number) => {
    const clickedSquare = board[row][col];

    if (!selected) {
      if (clickedSquare) {
        setSelected([row, col]);
      }
      return;
    }

    const [fromRow, fromCol] = selected;
    const selectedPiece = board[fromRow][fromCol];

    if (!selectedPiece) {
      setSelected(null);
      return;
    }

    const newBoard = board.map((r) => [...r]);

    newBoard[row][col] = selectedPiece;
    newBoard[fromRow][fromCol] = null;

    setBoard(newBoard);
    setSelected(null);

    console.log(
      `${selectedPiece.color} ${selectedPiece.type} moved from ${toChessNotation(
        fromRow,
        fromCol
      )} to ${toChessNotation(row, col)}`
    );
  };

  return (
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
                cursor: "pointer",
              }}
            >
              {piece && (
                <img
                  src={getPieceImage(piece)}
                  alt="piece"
                  width={50}
                  height={50}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}