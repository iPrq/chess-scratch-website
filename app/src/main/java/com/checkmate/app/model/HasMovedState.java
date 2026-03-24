package com.checkmate.app.model;

public class HasMovedState {
    private boolean whiteKing;
    private boolean blackKing;
    private boolean whiteRookLeft;
    private boolean whiteRookRight;
    private boolean blackRookLeft;
    private boolean blackRookRight;

    public HasMovedState() {
        this.whiteKing = false;
        this.blackKing = false;
        this.whiteRookLeft = false;
        this.whiteRookRight = false;
        this.blackRookLeft = false;
        this.blackRookRight = false;
    }

    // Getters
    public boolean isWhiteKing() { return whiteKing; }
    public boolean isBlackKing() { return blackKing; }
    public boolean isWhiteRookLeft() { return whiteRookLeft; }
    public boolean isWhiteRookRight() { return whiteRookRight; }
    public boolean isBlackRookLeft() { return blackRookLeft; }
    public boolean isBlackRookRight() { return blackRookRight; }

    // Setters
    public void setWhiteKing(boolean whiteKing) { this.whiteKing = whiteKing; }
    public void setBlackKing(boolean blackKing) { this.blackKing = blackKing; }
    public void setWhiteRookLeft(boolean whiteRookLeft) { this.whiteRookLeft = whiteRookLeft; }
    public void setWhiteRookRight(boolean whiteRookRight) { this.whiteRookRight = whiteRookRight; }
    public void setBlackRookLeft(boolean blackRookLeft) { this.blackRookLeft = blackRookLeft; }
    public void setBlackRookRight(boolean blackRookRight) { this.blackRookRight = blackRookRight; }
}
