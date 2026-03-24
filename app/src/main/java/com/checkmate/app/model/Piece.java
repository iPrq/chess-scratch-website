package com.checkmate.app.model;

public class Piece {
    private PieceType type;
    private Color color;

    public Piece(PieceType Type, Color color) {
        this.color = color;
        this.type = type;
    }

    public Piece() {
    }

    public PieceType getType() {
        return type;
    }

    public void setType(PieceType type) {
        this.type = type;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }
}
