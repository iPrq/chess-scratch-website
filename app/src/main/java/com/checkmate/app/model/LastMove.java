package com.checkmate.app.model;

public class LastMove {
    private int[] from;
    private int[] to;

    public LastMove(int fromRow, int fromCol, int toRow, int toCol) {

        this.from = new int[]{fromRow, fromCol};
        this.to = new int[]{toRow, toCol};
    }

    public LastMove() {
    }

    public int[] getFrom() {
        return from;
    }

    public void setFrom(int[] from) {
        this.from = from;
    }

    public int[] getTo() {
        return to;
    }

    public void setTo(int[] to) {
        this.to = to;
    }
}
