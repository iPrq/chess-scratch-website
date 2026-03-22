
export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type Color = "white" | "black";

export type Piece = {
  type: PieceType;
  color: Color;
};

export type Square = Piece | null;
export type Board = Square[][];

// MAIN FUNCTION (dispatcher)

export const getValidMoves = (
  board: Board,
  piece: Piece,
  row: number,
  col: number
): [number, number][] => {
  switch (piece.type) {
    case "pawn":
      return getPawnMoves(board, piece, row, col);
    case "rook":
      return getRookMoves(board, piece, row, col);
    case "knight":
      return getKnightMoves(board, piece, row, col);
    case "bishop":
      return getBishopMoves(board, piece, row, col);
    case "queen":
      return getQueenMoves(board, piece, row, col);
    case "king":
      return getKingMoves(board, piece, row, col);
    default:
      return [];
  }
};

//////////////////////////////////////////////////////
// ♟️ PAWN
//////////////////////////////////////////////////////

const getPawnMoves = (
  board: Board,
  piece: Piece,
  row: number,
  col: number
): [number, number][] => {
  const moves: [number, number][] = [];

  const direction = piece.color === "white" ? -1 : 1;
  const startRow = piece.color === "white" ? 6 : 1;


  if (board[row + direction]?.[col] === null) {
    moves.push([row + direction, col]);

    // forward 2
    if (
      row === startRow &&
      board[row + 2 * direction]?.[col] === null
    ) {
      moves.push([row + 2 * direction, col]);
    }
  }

  // captures
  for (let dc of [-1, 1]) {
    const newCol = col + dc;
    const target = board[row + direction]?.[newCol];

    if (target && target.color !== piece.color) {
      moves.push([row + direction, newCol]);
    }
  }

  return moves;
};

//////////////////////////////////////////////////////
// 🐴 KNIGHT
//////////////////////////////////////////////////////

const getKnightMoves = (
  board: Board,
  piece: Piece,
  row: number,
  col: number
): [number, number][] => {
  const moves: [number, number][] = [];

  const directions = [
    [2, 1], [2, -1],
    [-2, 1], [-2, -1],
    [1, 2], [1, -2],
    [-1, 2], [-1, -2],
  ];

  for (let [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;

    if (r < 0 || r > 7 || c < 0 || c > 7) continue;

    const target = board[r][c];

    if (!target || target.color !== piece.color) {
      moves.push([r, c]);
    }
  }

  return moves;
};

//////////////////////////////////////////////////////
// 🏰 ROOK
//////////////////////////////////////////////////////

const getRookMoves = (
  board: Board,
  piece: Piece,
  row: number,
  col: number
): [number, number][] => {
  const moves: [number, number][] = [];

  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ];

  for (let [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];

      if (!target) {
        moves.push([r, c]);
      } else {
        if (target.color !== piece.color) {
          moves.push([r, c]);
        }
        break;
      }

      r += dr;
      c += dc;
    }
  }

  return moves;
};

//////////////////////////////////////////////////////
// ⛪ BISHOP
//////////////////////////////////////////////////////

const getBishopMoves = (
  board: Board,
  piece: Piece,
  row: number,
  col: number
): [number, number][] => {
  const moves: [number, number][] = [];

  const directions = [
    [1, 1], [1, -1],
    [-1, 1], [-1, -1],
  ];

  for (let [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];

      if (!target) {
        moves.push([r, c]);
      } else {
        if (target.color !== piece.color) {
          moves.push([r, c]);
        }
        break;
      }

      r += dr;
      c += dc;
    }
  }

  return moves;
};

//////////////////////////////////////////////////////
// 👑 QUEEN
//////////////////////////////////////////////////////

const getQueenMoves = (
  board: Board,
  piece: Piece,
  row: number,
  col: number
): [number, number][] => {
  return [
    ...getRookMoves(board, piece, row, col),
    ...getBishopMoves(board, piece, row, col),
  ];
};

//////////////////////////////////////////////////////
// 🤴 KING
//////////////////////////////////////////////////////

const getKingMoves = (
  board: Board,
  piece: Piece,
  row: number,
  col: number
): [number, number][] => {
  const moves: [number, number][] = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      const r = row + dr;
      const c = col + dc;

      if (r < 0 || r > 7 || c < 0 || c > 7) continue;

      const target = board[r][c];

      if (!target || target.color !== piece.color) {
        moves.push([r, c]);
      }
    }
  }

  return moves;
};