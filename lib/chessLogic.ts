export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type Color = "white" | "black";

export type Piece = {
  type: PieceType;
  color: Color;
};

export type HasMovedState = {
  whiteKing: boolean;
  blackKing: boolean;
  whiteRookLeft: boolean;
  whiteRookRight: boolean;
  blackRookLeft: boolean;
  blackRookRight: boolean;
};

export type LastMove = {
  from: [number, number];
  to: [number, number];
};

export type Square = Piece | null;
export type Board = Square[][];

// MAIN FUNCTION (dispatcher)

export const getValidMoves = (
  board: Board,
  piece: Piece,
  row: number,
  col: number,
  hasMoved?: HasMovedState,
  lastMove?: LastMove | null
): [number, number][] => {
  switch (piece.type) {
    case "pawn":
      return getPawnMoves(board, piece, row, col, lastMove ?? null);
    case "rook":
      return getRookMoves(board, piece, row, col);
    case "knight":
      return getKnightMoves(board, piece, row, col);
    case "bishop":
      return getBishopMoves(board, piece, row, col);
    case "queen":
      return getQueenMoves(board, piece, row, col);
    case "king":
      return getKingMoves(board, piece, row, col, hasMoved);
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
  col: number,
  lastMove: LastMove | null
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

  // en passant
  if (lastMove) {
    const [fromRow, fromCol] = lastMove.from;
    const [toRow, toCol] = lastMove.to;
    const movedPiece = board[toRow]?.[toCol];

    const isOpponentPawnDoubleStep =
      !!movedPiece &&
      movedPiece.type === "pawn" &&
      movedPiece.color !== piece.color &&
      Math.abs(toRow - fromRow) === 2;

    const isAdjacent = toRow === row && Math.abs(toCol - col) === 1;
    const enPassantRow = row + direction;

    if (
      isOpponentPawnDoubleStep &&
      isAdjacent &&
      board[enPassantRow]?.[toCol] === null
    ) {
      moves.push([enPassantRow, toCol]);
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
  col: number,
  hasMoved?: HasMovedState
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

  const colorPrefix = piece.color === "white" ? "white" : "black";
  const kingKey = `${colorPrefix}King` as const;
  const rookLeftKey = `${colorPrefix}RookLeft` as const;
  const rookRightKey = `${colorPrefix}RookRight` as const;
  const enemyColor: Color = piece.color === "white" ? "black" : "white";

  // castling
  if (hasMoved && !hasMoved[kingKey]) {
    const homeRow = piece.color === "white" ? 7 : 0;
    const kingOnHomeSquare = row === homeRow && col === 4;

    if (kingOnHomeSquare && !isSquareAttacked(board, row, col, enemyColor)) {
      const kingsideRook = board[homeRow][7];
      const canCastleKingside =
        kingsideRook?.type === "rook" &&
        kingsideRook.color === piece.color &&
        !hasMoved[rookRightKey] &&
        board[homeRow][5] === null &&
        board[homeRow][6] === null &&
        !isSquareAttacked(board, homeRow, 5, enemyColor) &&
        !isSquareAttacked(board, homeRow, 6, enemyColor);

      if (canCastleKingside) {
        moves.push([homeRow, 6]);
      }

      const queensideRook = board[homeRow][0];
      const canCastleQueenside =
        queensideRook?.type === "rook" &&
        queensideRook.color === piece.color &&
        !hasMoved[rookLeftKey] &&
        board[homeRow][1] === null &&
        board[homeRow][2] === null &&
        board[homeRow][3] === null &&
        !isSquareAttacked(board, homeRow, 3, enemyColor) &&
        !isSquareAttacked(board, homeRow, 2, enemyColor);

      if (canCastleQueenside) {
        moves.push([homeRow, 2]);
      }
    }
  }

  return moves;
};

const getAttackMoves = (
  board: Board,
  piece: Piece,
  row: number,
  col: number
): [number, number][] => {
  if (piece.type === "pawn") {
    const direction = piece.color === "white" ? -1 : 1;
    const attacks: [number, number][] = [];
    for (const dc of [-1, 1]) {
      const r = row + direction;
      const c = col + dc;
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        attacks.push([r, c]);
      }
    }
    return attacks;
  }

  if (piece.type === "king") {
    const attacks: [number, number][] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
          attacks.push([r, c]);
        }
      }
    }
    return attacks;
  }

  return getValidMoves(board, piece, row, col);
};


const findKing = (board: Board, color: Color): [number, number] | null => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === "king" && piece.color === color) {
        return [r, c];
      }
    }
  }
  return null;
};


const isSquareAttacked = (
  board: Board,
  row: number,
  col: number,
  byColor: Color
): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];

      if (piece && piece.color === byColor) {
        const moves = getAttackMoves(board, piece, r, c);

        if (moves.some(([mr, mc]) => mr === row && mc === col)) {
          return true;
        }
      }
    }
  }
  return false;
};


export const isKingInCheck = (board: Board, color: Color): boolean => {
  const kingPos = findKing(board, color);

  if (!kingPos) return false;

  const [kr, kc] = kingPos;

  const enemyColor = color === "white" ? "black" : "white";

  return isSquareAttacked(board, kr, kc, enemyColor);
};

export const getLegalMoves = (
  board: Board,
  piece: Piece,
  row: number,
  col: number,
  hasMoved?: HasMovedState,
  lastMove?: LastMove | null
): [number, number][] => {
  const rawMoves = getValidMoves(board, piece, row, col, hasMoved, lastMove);

  const legalMoves: [number, number][] = [];

  for (let [r, c] of rawMoves) {
    const newBoard = board.map((rowArr) => [...rowArr]);

    if (piece.type === "pawn" && c !== col && newBoard[r][c] === null) {
      // en passant capture removes the adjacent pawn, not the destination square
      newBoard[row][c] = null;
    }

    if (piece.type === "king" && Math.abs(c - col) === 2) {
      // castling also moves the corresponding rook
      if (c === 6) {
        newBoard[row][5] = newBoard[row][7];
        newBoard[row][7] = null;
      } else if (c === 2) {
        newBoard[row][3] = newBoard[row][0];
        newBoard[row][0] = null;
      }
    }

    // simulate move
    newBoard[r][c] = piece;
    newBoard[row][col] = null;

    // check if king is in check AFTER move
    if (!isKingInCheck(newBoard, piece.color)) {
      legalMoves.push([r, c]);
    }
  }

  return legalMoves;
};

const hasAnyLegalMoves = (
  board: Board,
  color: Color,
  hasMoved?: HasMovedState,
  lastMove?: LastMove | null
): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== color) continue;

      const legalMoves = getLegalMoves(board, piece, r, c, hasMoved, lastMove);
      if (legalMoves.length > 0) {
        return true;
      }
    }
  }
  return false;
};

export const isCheckmate = (
  board: Board,
  color: Color,
  hasMoved?: HasMovedState,
  lastMove?: LastMove | null
): boolean => {
  return isKingInCheck(board, color) && !hasAnyLegalMoves(board, color, hasMoved, lastMove);
};

export const isStalemate = (
  board: Board,
  color: Color,
  hasMoved?: HasMovedState,
  lastMove?: LastMove | null
): boolean => {
  return !isKingInCheck(board, color) && !hasAnyLegalMoves(board, color, hasMoved, lastMove);
};