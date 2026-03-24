package com.checkmate.app.model;

public class GameStatus {
    private boolean whiteInCheck;
    private boolean blackInCheck;
    private boolean currentPlayerCheckmated;
    private boolean currentPlayerStalemated;
    private boolean gameOver;
    private Color winner;
    private Color drawOfferedByColor;
    private boolean isDraw;

    public GameStatus() {
        this.whiteInCheck = false;
        this.blackInCheck = false;
        this.currentPlayerCheckmated = false;
        this.currentPlayerStalemated = false;
        this.gameOver = false;
        this.winner = null;
        this.drawOfferedByColor = null;
        this.isDraw = false;
    }

    // Getters and Setters
    public boolean isWhiteInCheck() { return whiteInCheck; }
    public void setWhiteInCheck(boolean whiteInCheck) { this.whiteInCheck = whiteInCheck; }

    public boolean isBlackInCheck() { return blackInCheck; }
    public void setBlackInCheck(boolean blackInCheck) { this.blackInCheck = blackInCheck; }

    public boolean isCurrentPlayerCheckmated() { return currentPlayerCheckmated; }
    public void setCurrentPlayerCheckmated(boolean currentPlayerCheckmated) { this.currentPlayerCheckmated = currentPlayerCheckmated; }

    public boolean isCurrentPlayerStalemated() { return currentPlayerStalemated; }
    public void setCurrentPlayerStalemated(boolean currentPlayerStalemated) { this.currentPlayerStalemated = currentPlayerStalemated; }

    public boolean isGameOver() { return gameOver; }
    public void setGameOver(boolean gameOver) { this.gameOver = gameOver; }

    public Color getWinner() { return winner; }
    public void setWinner(Color winner) { this.winner = winner; }

    public Color getDrawOfferedByColor() { return drawOfferedByColor; }
    public void setDrawOfferedByColor(Color drawOfferedByColor) { this.drawOfferedByColor = drawOfferedByColor; }

    public boolean isDraw() { return isDraw; }
    public void setDraw(boolean isDraw) { this.isDraw = isDraw; }
}
