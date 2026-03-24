package com.checkmate.app.model;

public class GameActionRequest {
    private String gameId;
    private String playerId;
    private String action;

    public GameActionRequest() {}

    public GameActionRequest(String gameId, String playerId, String action) {
        this.gameId = gameId;
        this.playerId = playerId;
        this.action = action;
    }

    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }

    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
}
