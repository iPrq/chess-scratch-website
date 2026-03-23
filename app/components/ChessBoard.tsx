"use client";

import { useState } from "react";
import { JSX } from "react";
import {
  getLegalMoves,
  isKingInCheck,
  isCheckmate,
  isStalemate,
  type HasMovedState,
  type LastMove,
} from "../../lib/chessLogic";

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
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [turn, setTurn] = useState<"white" | "black">("white");
  const whiteInCheck = isKingInCheck(board, "white");
  const blackInCheck = isKingInCheck(board, "black");
  const [hasMoved, setHasMoved] = useState<HasMovedState>({
    whiteKing : false,
    blackKing : false,
    whiteRookLeft : false,
    whiteRookRight : false,
    blackRookLeft : false,
    blackRookRight : false,
  });
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  

  const handleClick = (row: number, col: number) => {
    if (gameOver) return;

    const clickedSquare = board[row][col];

    if (!selected) {
      if (clickedSquare && clickedSquare.color === turn) {
        setSelected([row, col]);

        const moves = getLegalMoves(board, clickedSquare, row, col, hasMoved, lastMove);
        setValidMoves(moves);
      }
      return;
    }

    const [fromRow, fromCol] = selected;
    const selectedPiece = board[fromRow][fromCol];

    if (!selectedPiece) {
      setSelected(null);
      setValidMoves([]);
      return;
    }

    if (clickedSquare && clickedSquare.color === turn) {
      setSelected([row, col]);

      const moves = getLegalMoves(board, clickedSquare, row, col, hasMoved, lastMove);
      setValidMoves(moves);
      return;
    }


    const isMoveValid = validMoves.some(
      ([r, c]) => r === row && c === col
    );

    if (!isMoveValid) {
      return; 
    }


    const newBoard = board.map((r) => [...r]);

    const isEnPassantCapture =
      selectedPiece.type === "pawn" &&
      fromCol !== col &&
      clickedSquare === null;

    if (isEnPassantCapture) {
      newBoard[fromRow][col] = null;
    }

    const isCastlingMove =
      selectedPiece.type === "king" && Math.abs(col - fromCol) === 2;

    if (isCastlingMove) {
      if (col === 6) {
        newBoard[row][5] = newBoard[row][7];
        newBoard[row][7] = null;
      } else if (col === 2) {
        newBoard[row][3] = newBoard[row][0];
        newBoard[row][0] = null;
      }
    }

    newBoard[row][col] = selectedPiece;
    newBoard[fromRow][fromCol] = null;

    setHasMoved((prev) => {
      const next = { ...prev };

      if (selectedPiece.type === "king") {
        if (selectedPiece.color === "white") {
          next.whiteKing = true;
        } else {
          next.blackKing = true;
        }
      }

      if (selectedPiece.type === "rook") {
        if (selectedPiece.color === "white" && fromRow === 7 && fromCol === 0) {
          next.whiteRookLeft = true;
        }
        if (selectedPiece.color === "white" && fromRow === 7 && fromCol === 7) {
          next.whiteRookRight = true;
        }
        if (selectedPiece.color === "black" && fromRow === 0 && fromCol === 0) {
          next.blackRookLeft = true;
        }
        if (selectedPiece.color === "black" && fromRow === 0 && fromCol === 7) {
          next.blackRookRight = true;
        }
      }

      return next;
    });

    setLastMove({ from: [fromRow, fromCol], to: [row, col] });

    setBoard(newBoard);
    setSelected(null);
    setValidMoves([]);

    setTurn((prev) => (prev === "white" ? "black" : "white"));

    console.log(
      `${selectedPiece.color} ${selectedPiece.type} moved from ${toChessNotation(
        fromRow,
        fromCol
      )} to ${toChessNotation(row, col)}`
    );
  };

  const currentPlayerCheckmated = isCheckmate(board, turn, hasMoved, lastMove);
  const currentPlayerStalemated = isStalemate(board, turn, hasMoved, lastMove);
  const gameOver = currentPlayerCheckmated || currentPlayerStalemated;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {currentPlayerCheckmated && (
        <div style={{ backgroundColor: "#ffe1e1", color: "#8b0000", border: "1px solid #ff8a8a", padding: "8px 10px", width: "480px", fontWeight: 700 }}>
          Checkmate! {turn === "white" ? "Black" : "White"} wins.
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