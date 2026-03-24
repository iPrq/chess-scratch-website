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

export type GameStatus = {
  whiteInCheck: boolean;
  blackInCheck: boolean;
  currentPlayerCheckmated: boolean;
  currentPlayerStalemated: boolean;
  gameOver: boolean;
  winner: Color | null;
};

export type GameState = {
  board: Board;
  turn: Color;
  selected: [number, number] | null;
  validMoves: [number, number][];
  hasMoved: HasMovedState;
  lastMove: LastMove | null;
  status: GameStatus;
};

export type Square = Piece | null;
export type Board = Square[][];

const createPawnRow = (color: Color): Piece[] =>
  Array.from({ length: 8 }, () => ({ type: "pawn", color }));

export const createInitialBoard = (): Board => [
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

export const createInitialHasMoved = (): HasMovedState => ({
  whiteKing: false,
  blackKing: false,
  whiteRookLeft: false,
  whiteRookRight: false,
  blackRookLeft: false,
  blackRookRight: false,
});

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

const getStatusForTurn = (
  board: Board,
  turn: Color,
  hasMoved: HasMovedState,
  lastMove: LastMove | null
): GameStatus => {
  const whiteInCheck = isKingInCheck(board, "white");
  const blackInCheck = isKingInCheck(board, "black");
  const currentPlayerCheckmated = isCheckmate(board, turn, hasMoved, lastMove);
  const currentPlayerStalemated = isStalemate(board, turn, hasMoved, lastMove);
  const gameOver = currentPlayerCheckmated || currentPlayerStalemated;
  const winner = currentPlayerCheckmated
    ? (turn === "white" ? "black" : "white")
    : null;

  return {
    whiteInCheck,
    blackInCheck,
    currentPlayerCheckmated,
    currentPlayerStalemated,
    gameOver,
    winner,
  };
};

const cloneBoard = (board: Board): Board => board.map((r) => [...r]);

const updateHasMovedAfterMove = (
  hasMoved: HasMovedState,
  piece: Piece,
  fromRow: number,
  fromCol: number,
  toCol: number
): HasMovedState => {
  const next = { ...hasMoved };

  if (piece.type === "king") {
    if (piece.color === "white") {
      next.whiteKing = true;
      if (Math.abs(toCol - fromCol) === 2) {
        if (toCol === 6) next.whiteRookRight = true;
        if (toCol === 2) next.whiteRookLeft = true;
      }
    } else {
      next.blackKing = true;
      if (Math.abs(toCol - fromCol) === 2) {
        if (toCol === 6) next.blackRookRight = true;
        if (toCol === 2) next.blackRookLeft = true;
      }
    }
  }

  if (piece.type === "rook") {
    if (piece.color === "white" && fromRow === 7 && fromCol === 0) next.whiteRookLeft = true;
    if (piece.color === "white" && fromRow === 7 && fromCol === 7) next.whiteRookRight = true;
    if (piece.color === "black" && fromRow === 0 && fromCol === 0) next.blackRookLeft = true;
    if (piece.color === "black" && fromRow === 0 && fromCol === 7) next.blackRookRight = true;
  }

  return next;
};

export const createInitialGameState = (): GameState => {
  const board = createInitialBoard();
  const turn: Color = "white";
  const hasMoved = createInitialHasMoved();
  const lastMove: LastMove | null = null;

  return {
    board,
    turn,
    selected: null,
    validMoves: [],
    hasMoved,
    lastMove,
    status: getStatusForTurn(board, turn, hasMoved, lastMove),
  };
};

export const handleSquareClick = (
  state: GameState,
  row: number,
  col: number
): GameState => {
  if (state.status.gameOver) return state;

  const { board, turn, selected, hasMoved, lastMove } = state;
  const clickedSquare = board[row][col];

  if (!selected) {
    if (clickedSquare && clickedSquare.color === turn) {
      return {
        ...state,
        selected: [row, col],
        validMoves: getLegalMoves(board, clickedSquare, row, col, hasMoved, lastMove),
      };
    }
    return state;
  }

  const [fromRow, fromCol] = selected;
  const selectedPiece = board[fromRow][fromCol];

  if (!selectedPiece) {
    return {
      ...state,
      selected: null,
      validMoves: [],
    };
  }

  if (clickedSquare && clickedSquare.color === turn) {
    return {
      ...state,
      selected: [row, col],
      validMoves: getLegalMoves(board, clickedSquare, row, col, hasMoved, lastMove),
    };
  }

  const isMoveValid = state.validMoves.some(([r, c]) => r === row && c === col);
  if (!isMoveValid) return state;

  const newBoard = cloneBoard(board);

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

  const nextHasMoved = updateHasMovedAfterMove(
    hasMoved,
    selectedPiece,
    fromRow,
    fromCol,
    col
  );
  const nextLastMove: LastMove = { from: [fromRow, fromCol], to: [row, col] };
  const nextTurn: Color = turn === "white" ? "black" : "white";

  return {
    board: newBoard,
    selected: null,
    validMoves: [],
    turn: nextTurn,
    hasMoved: nextHasMoved,
    lastMove: nextLastMove,
    status: getStatusForTurn(newBoard, nextTurn, nextHasMoved, nextLastMove),
  };
};