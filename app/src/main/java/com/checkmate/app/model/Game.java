package com.checkmate.app.model;

import java.util.ArrayList;
import java.util.List;

public class Game {
    private String gameId;

    private List<String> players = new ArrayList<>();

    private Piece[][] board;

    private Color turn = Color.WHITE;

    public Game(String gameId) {
        this.gameId = gameId;
        this.board = initializeBoard();
    }

    public Piece[][] initializeBoard() {
        Piece[][] board = new Piece[8][8];

        for (int i = 0; i < 8; i++) {
            board[1][i] = new Piece(PieceType.PAWN, Color.BLACK);
            board[6][i] = new Piece(PieceType.PAWN, Color.WHITE);
        }
        return board;
    }

    public String getGameId() {
        return gameId;
    }

    public Color getTurn() {
        return turn;
    }

    public void switchTurn() {
        turn = (turn == Color.WHITE) ? Color.BLACK : Color.WHITE;
    }
}
