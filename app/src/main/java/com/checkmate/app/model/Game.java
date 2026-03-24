package com.checkmate.app.model;

import java.util.ArrayList;
import java.util.List;

public class Game {
    private String gameId;
    private List<String> players = new ArrayList<>();
    private Piece[][] board;
    private Color turn = Color.WHITE;
    private HasMovedState hasMoved;
    private LastMove lastMove;
    private GameStatus status;

    public Game(String gameId) {
        this.gameId = gameId;
        this.board = initializeBoard();
        this.hasMoved = new HasMovedState();
        this.lastMove = null;
        this.status = new GameStatus();
    }

    public Piece[][] initializeBoard() {
        Piece[][] board = new Piece[8][8];

        PieceType[] majorPieces = {
            PieceType.ROOK, PieceType.KNIGHT, PieceType.BISHOP, PieceType.QUEEN, 
            PieceType.KING, PieceType.BISHOP, PieceType.KNIGHT, PieceType.ROOK
        };

        for (int i = 0; i < 8; i++) {
            board[0][i] = new Piece(majorPieces[i], Color.BLACK);
            board[1][i] = new Piece(PieceType.PAWN, Color.BLACK);
            
            board[6][i] = new Piece(PieceType.PAWN, Color.WHITE);
            board[7][i] = new Piece(majorPieces[i], Color.WHITE);
        }
        return board;
    }

    public String getGameId() { return gameId; }
    public Color getTurn() { return turn; }
    public void setTurn(Color turn) { this.turn = turn; }
    public void switchTurn() { turn = (turn == Color.WHITE) ? Color.BLACK : Color.WHITE; }
    
    public List<String> getPlayers() { return players; }
    public Piece[][] getBoard() { return board; }
    public void setBoard(Piece[][] board) { this.board = board; }

    public HasMovedState getHasMoved() { return hasMoved; }
    public void setHasMoved(HasMovedState hasMoved) { this.hasMoved = hasMoved; }

    public LastMove getLastMove() { return lastMove; }
    public void setLastMove(LastMove lastMove) { this.lastMove = lastMove; }

    public GameStatus getStatus() { return status; }
    public void setStatus(GameStatus status) { this.status = status; }
}
