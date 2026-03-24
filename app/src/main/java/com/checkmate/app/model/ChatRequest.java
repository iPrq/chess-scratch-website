package com.checkmate.app.model;

public class ChatRequest {
    private String gameId;
    private String playerId;
    private String text;

    public ChatRequest() {}

    public ChatRequest(String gameId, String playerId, String text) {
        this.gameId = gameId;
        this.playerId = playerId;
        this.text = text;
    }

    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }

    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
