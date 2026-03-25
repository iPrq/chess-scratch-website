package com.checkmate.app.services;

import com.checkmate.app.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChessLogicService {

    public boolean applyMove(Game game, Move move) {
        if (game.getStatus().isGameOver()) {
            return false;
        }

        Piece[][] board = game.getBoard();
        int fromRow = move.getFromRow();
        int fromCol = move.getFromCol();
        int toRow = move.getToRow();
        int toCol = move.getToCol();

        Piece piece = board[fromRow][fromCol];
        if (piece == null || piece.getColor() != game.getTurn()) {
            return false;
        }

        List<int[]> legalMoves = getLegalMoves(board, piece, fromRow, fromCol, game.getHasMoved(), game.getLastMove());
        
        boolean isLegal = false;
        for (int[] m : legalMoves) {
            if (m[0] == toRow && m[1] == toCol) {
                isLegal = true;
                break;
            }
        }

        if (!isLegal) {
            return false;
        }

        // Apply en passant capture
        if (piece.getType() == PieceType.PAWN && fromCol != toCol && board[toRow][toCol] == null) {
            board[fromRow][toCol] = null;
        }

        // Apply castling rook move
        if (piece.getType() == PieceType.KING && Math.abs(toCol - fromCol) == 2) {
            if (toCol == 6) {
                board[toRow][5] = board[toRow][7];
                board[toRow][7] = null;
            } else if (toCol == 2) {
                board[toRow][3] = board[toRow][0];
                board[toRow][0] = null;
            }
        }

        // Move piece
        board[toRow][toCol] = piece;
        board[fromRow][fromCol] = null;

        // Apply pawn promotion
        if (piece.getType() == PieceType.PAWN && (toRow == 0 || toRow == 7)) {
            String promo = move.getPromotionPiece();
            if (promo != null && !promo.isEmpty()) {
                try {
                    piece.setType(PieceType.valueOf(promo.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    piece.setType(PieceType.QUEEN);
                }
            } else {
                piece.setType(PieceType.QUEEN);
            }
        }

        game.setHasMoved(updateHasMovedAfterMove(game.getHasMoved(), piece, fromRow, fromCol, toCol));
        game.setLastMove(new LastMove(fromRow, fromCol, toRow, toCol));
        game.getMoveHistory().add(move);
        game.switchTurn();

        updateGameStatus(game);
        updateCurrentLegalMoves(game);

        return true;
    }

    public void updateCurrentLegalMoves(Game game) {
        List<Move> currentLegalMoves = new ArrayList<>();
        if (!game.getStatus().isGameOver()) {
            Piece[][] board = game.getBoard();
            for (int r = 0; r < 8; r++) {
                for (int c = 0; c < 8; c++) {
                    Piece piece = board[r][c];
                    if (piece != null && piece.getColor() == game.getTurn()) {
                        List<int[]> moves = getLegalMoves(board, piece, r, c, game.getHasMoved(), game.getLastMove());
                        for (int[] m : moves) {
                            currentLegalMoves.add(new Move(game.getGameId(), r, c, m[0], m[1]));
                        }
                    }
                }
            }
        }
        game.setCurrentLegalMoves(currentLegalMoves);
    }

    private void updateGameStatus(Game game) {
        Piece[][] board = game.getBoard();
        Color turn = game.getTurn();
        HasMovedState hasMoved = game.getHasMoved();
        LastMove lastMove = game.getLastMove();

        boolean whiteInCheck = isKingInCheck(board, Color.WHITE);
        boolean blackInCheck = isKingInCheck(board, Color.BLACK);
        boolean currentPlayerCheckmated = isCheckmate(board, turn, hasMoved, lastMove);
        boolean currentPlayerStalemated = isStalemate(board, turn, hasMoved, lastMove);
        
        GameStatus status = game.getStatus();
        status.setWhiteInCheck(whiteInCheck);
        status.setBlackInCheck(blackInCheck);
        status.setCurrentPlayerCheckmated(currentPlayerCheckmated);
        status.setCurrentPlayerStalemated(currentPlayerStalemated);
        status.setGameOver(currentPlayerCheckmated || currentPlayerStalemated);

        if (currentPlayerCheckmated) {
            status.setWinner(turn == Color.WHITE ? Color.BLACK : Color.WHITE);
        } else {
            status.setWinner(null);
        }
    }

    private HasMovedState updateHasMovedAfterMove(HasMovedState hasMoved, Piece piece, int fromRow, int fromCol, int toCol) {
        HasMovedState next = new HasMovedState();
        next.setWhiteKing(hasMoved.isWhiteKing());
        next.setBlackKing(hasMoved.isBlackKing());
        next.setWhiteRookLeft(hasMoved.isWhiteRookLeft());
        next.setWhiteRookRight(hasMoved.isWhiteRookRight());
        next.setBlackRookLeft(hasMoved.isBlackRookLeft());
        next.setBlackRookRight(hasMoved.isBlackRookRight());

        if (piece.getType() == PieceType.KING) {
            if (piece.getColor() == Color.WHITE) {
                next.setWhiteKing(true);
                if (Math.abs(toCol - fromCol) == 2) {
                    if (toCol == 6) next.setWhiteRookRight(true);
                    if (toCol == 2) next.setWhiteRookLeft(true);
                }
            } else {
                next.setBlackKing(true);
                if (Math.abs(toCol - fromCol) == 2) {
                    if (toCol == 6) next.setBlackRookRight(true);
                    if (toCol == 2) next.setBlackRookLeft(true);
                }
            }
        }

        if (piece.getType() == PieceType.ROOK) {
            if (piece.getColor() == Color.WHITE && fromRow == 7 && fromCol == 0) next.setWhiteRookLeft(true);
            if (piece.getColor() == Color.WHITE && fromRow == 7 && fromCol == 7) next.setWhiteRookRight(true);
            if (piece.getColor() == Color.BLACK && fromRow == 0 && fromCol == 0) next.setBlackRookLeft(true);
            if (piece.getColor() == Color.BLACK && fromRow == 0 && fromCol == 7) next.setBlackRookRight(true);
        }

        return next;
    }

    public List<int[]> getLegalMoves(Piece[][] board, Piece piece, int row, int col, HasMovedState hasMoved, LastMove lastMove) {
        List<int[]> rawMoves = getValidMoves(board, piece, row, col, hasMoved, lastMove);
        List<int[]> legalMoves = new ArrayList<>();

        for (int[] move : rawMoves) {
            int r = move[0];
            int c = move[1];

            Piece[][] newBoard = cloneBoard(board);

            if (piece.getType() == PieceType.PAWN && c != col && newBoard[r][c] == null) {
                newBoard[row][c] = null; // en passant
            }

            if (piece.getType() == PieceType.KING && Math.abs(c - col) == 2) {
                if (c == 6) {
                    newBoard[row][5] = newBoard[row][7];
                    newBoard[row][7] = null;
                } else if (c == 2) {
                    newBoard[row][3] = newBoard[row][0];
                    newBoard[row][0] = null;
                }
            }

            newBoard[r][c] = piece;
            newBoard[row][col] = null;

            if (!isKingInCheck(newBoard, piece.getColor())) {
                legalMoves.add(new int[]{r, c});
            }
        }

        return legalMoves;
    }

    private List<int[]> getValidMoves(Piece[][] board, Piece piece, int row, int col, HasMovedState hasMoved, LastMove lastMove) {
        switch (piece.getType()) {
            case PAWN: return getPawnMoves(board, piece, row, col, lastMove);
            case ROOK: return getRookMoves(board, piece, row, col);
            case KNIGHT: return getKnightMoves(board, piece, row, col);
            case BISHOP: return getBishopMoves(board, piece, row, col);
            case QUEEN: return getQueenMoves(board, piece, row, col);
            case KING: return getKingMoves(board, piece, row, col, hasMoved);
            default: return new ArrayList<>();
        }
    }

    private List<int[]> getPawnMoves(Piece[][] board, Piece piece, int row, int col, LastMove lastMove) {
        List<int[]> moves = new ArrayList<>();
        int direction = piece.getColor() == Color.WHITE ? -1 : 1;
        int startRow = piece.getColor() == Color.WHITE ? 6 : 1;

        if (isValidPos(row + direction, col) && board[row + direction][col] == null) {
            moves.add(new int[]{row + direction, col});
            if (row == startRow && board[row + 2 * direction][col] == null) {
                moves.add(new int[]{row + 2 * direction, col});
            }
        }

        for (int dc : new int[]{-1, 1}) {
            int newCol = col + dc;
            if (isValidPos(row + direction, newCol)) {
                Piece target = board[row + direction][newCol];
                if (target != null && target.getColor() != piece.getColor()) {
                    moves.add(new int[]{row + direction, newCol});
                }
            }
        }

        if (lastMove != null) {
            int fromRow = lastMove.getFrom()[0];
            int fromCol = lastMove.getFrom()[1];
            int toRow = lastMove.getTo()[0];
            int toCol = lastMove.getTo()[1];

            Piece movedPiece = board[toRow][toCol];
            boolean isOpponentPawnDoubleStep = movedPiece != null && movedPiece.getType() == PieceType.PAWN 
                    && movedPiece.getColor() != piece.getColor() && Math.abs(toRow - fromRow) == 2;
            boolean isAdjacent = toRow == row && Math.abs(toCol - col) == 1;
            int enPassantRow = row + direction;

            if (isOpponentPawnDoubleStep && isAdjacent && board[enPassantRow][toCol] == null) {
                moves.add(new int[]{enPassantRow, toCol});
            }
        }

        return moves;
    }

    private List<int[]> getKnightMoves(Piece[][] board, Piece piece, int row, int col) {
        List<int[]> moves = new ArrayList<>();
        int[][] directions = {{2, 1}, {2, -1}, {-2, 1}, {-2, -1}, {1, 2}, {1, -2}, {-1, 2}, {-1, -2}};
        
        for (int[] dir : directions) {
            int r = row + dir[0];
            int c = col + dir[1];
            if (isValidPos(r, c)) {
                Piece target = board[r][c];
                if (target == null || target.getColor() != piece.getColor()) {
                    moves.add(new int[]{r, c});
                }
            }
        }
        return moves;
    }

    private List<int[]> getRookMoves(Piece[][] board, Piece piece, int row, int col) {
        List<int[]> moves = new ArrayList<>();
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        
        for (int[] dir : directions) {
            int r = row + dir[0];
            int c = col + dir[1];
            while (isValidPos(r, c)) {
                Piece target = board[r][c];
                if (target == null) {
                    moves.add(new int[]{r, c});
                } else {
                    if (target.getColor() != piece.getColor()) {
                        moves.add(new int[]{r, c});
                    }
                    break;
                }
                r += dir[0];
                c += dir[1];
            }
        }
        return moves;
    }

    private List<int[]> getBishopMoves(Piece[][] board, Piece piece, int row, int col) {
        List<int[]> moves = new ArrayList<>();
        int[][] directions = {{1, 1}, {1, -1}, {-1, 1}, {-1, -1}};
        
        for (int[] dir : directions) {
            int r = row + dir[0];
            int c = col + dir[1];
            while (isValidPos(r, c)) {
                Piece target = board[r][c];
                if (target == null) {
                    moves.add(new int[]{r, c});
                } else {
                    if (target.getColor() != piece.getColor()) {
                        moves.add(new int[]{r, c});
                    }
                    break;
                }
                r += dir[0];
                c += dir[1];
            }
        }
        return moves;
    }

    private List<int[]> getQueenMoves(Piece[][] board, Piece piece, int row, int col) {
        List<int[]> moves = new ArrayList<>();
        moves.addAll(getRookMoves(board, piece, row, col));
        moves.addAll(getBishopMoves(board, piece, row, col));
        return moves;
    }

    private List<int[]> getKingMoves(Piece[][] board, Piece piece, int row, int col, HasMovedState hasMoved) {
        List<int[]> moves = new ArrayList<>();
        for (int dr = -1; dr <= 1; dr++) {
            for (int dc = -1; dc <= 1; dc++) {
                if (dr == 0 && dc == 0) continue;
                int r = row + dr;
                int c = col + dc;
                if (isValidPos(r, c)) {
                    Piece target = board[r][c];
                    if (target == null || target.getColor() != piece.getColor()) {
                        moves.add(new int[]{r, c});
                    }
                }
            }
        }

        Color enemyColor = piece.getColor() == Color.WHITE ? Color.BLACK : Color.WHITE;
        
        if (hasMoved != null) {
            boolean kingMoved = piece.getColor() == Color.WHITE ? hasMoved.isWhiteKing() : hasMoved.isBlackKing();
            if (!kingMoved) {
                int homeRow = piece.getColor() == Color.WHITE ? 7 : 0;
                if (row == homeRow && col == 4 && !isSquareAttacked(board, row, col, enemyColor)) {
                    Piece kingsideRook = board[homeRow][7];
                    boolean rookRightMoved = piece.getColor() == Color.WHITE ? hasMoved.isWhiteRookRight() : hasMoved.isBlackRookRight();
                    if (kingsideRook != null && kingsideRook.getType() == PieceType.ROOK && kingsideRook.getColor() == piece.getColor()
                            && !rookRightMoved && board[homeRow][5] == null && board[homeRow][6] == null
                            && !isSquareAttacked(board, homeRow, 5, enemyColor) && !isSquareAttacked(board, homeRow, 6, enemyColor)) {
                        moves.add(new int[]{homeRow, 6});
                    }

                    Piece queensideRook = board[homeRow][0];
                    boolean rookLeftMoved = piece.getColor() == Color.WHITE ? hasMoved.isWhiteRookLeft() : hasMoved.isBlackRookLeft();
                    if (queensideRook != null && queensideRook.getType() == PieceType.ROOK && queensideRook.getColor() == piece.getColor()
                            && !rookLeftMoved && board[homeRow][1] == null && board[homeRow][2] == null && board[homeRow][3] == null
                            && !isSquareAttacked(board, homeRow, 3, enemyColor) && !isSquareAttacked(board, homeRow, 2, enemyColor)) {
                        moves.add(new int[]{homeRow, 2});
                    }
                }
            }
        }

        return moves;
    }

    private List<int[]> getAttackMoves(Piece[][] board, Piece piece, int row, int col) {
        if (piece.getType() == PieceType.PAWN) {
            int direction = piece.getColor() == Color.WHITE ? -1 : 1;
            List<int[]> attacks = new ArrayList<>();
            for (int dc : new int[]{-1, 1}) {
                int r = row + direction;
                int c = col + dc;
                if (isValidPos(r, c)) attacks.add(new int[]{r, c});
            }
            return attacks;
        }

        if (piece.getType() == PieceType.KING) {
            List<int[]> attacks = new ArrayList<>();
            for (int dr = -1; dr <= 1; dr++) {
                for (int dc = -1; dc <= 1; dc++) {
                    if (dr == 0 && dc == 0) continue;
                    int r = row + dr;
                    int c = col + dc;
                    if (isValidPos(r, c)) attacks.add(new int[]{r, c});
                }
            }
            return attacks;
        }

        return getValidMoves(board, piece, row, col, null, null);
    }

    private boolean isSquareAttacked(Piece[][] board, int row, int col, Color byColor) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Piece piece = board[r][c];
                if (piece != null && piece.getColor() == byColor) {
                    List<int[]> moves = getAttackMoves(board, piece, r, c);
                    for (int[] m : moves) {
                        if (m[0] == row && m[1] == col) return true;
                    }
                }
            }
        }
        return false;
    }

    public boolean isKingInCheck(Piece[][] board, Color color) {
        int[] kingPos = null;
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Piece piece = board[r][c];
                if (piece != null && piece.getType() == PieceType.KING && piece.getColor() == color) {
                    kingPos = new int[]{r, c};
                }
            }
        }
        if (kingPos == null) return false;
        Color enemyColor = color == Color.WHITE ? Color.BLACK : Color.WHITE;
        return isSquareAttacked(board, kingPos[0], kingPos[1], enemyColor);
    }

    private boolean hasAnyLegalMoves(Piece[][] board, Color color, HasMovedState hasMoved, LastMove lastMove) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Piece piece = board[r][c];
                if (piece != null && piece.getColor() == color) {
                    List<int[]> legalMoves = getLegalMoves(board, piece, r, c, hasMoved, lastMove);
                    if (!legalMoves.isEmpty()) return true;
                }
            }
        }
        return false;
    }

    public boolean isCheckmate(Piece[][] board, Color color, HasMovedState hasMoved, LastMove lastMove) {
        return isKingInCheck(board, color) && !hasAnyLegalMoves(board, color, hasMoved, lastMove);
    }

    public boolean isStalemate(Piece[][] board, Color color, HasMovedState hasMoved, LastMove lastMove) {
        return !isKingInCheck(board, color) && !hasAnyLegalMoves(board, color, hasMoved, lastMove);
    }

    private boolean isValidPos(int r, int c) {
        return r >= 0 && r < 8 && c >= 0 && c < 8;
    }

    private Piece[][] cloneBoard(Piece[][] board) {
        Piece[][] newBoard = new Piece[8][8];
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                newBoard[r][c] = board[r][c];
            }
        }
        return newBoard;
    }
}
