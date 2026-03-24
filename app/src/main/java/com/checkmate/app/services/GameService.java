package com.checkmate.app.services;

import com.checkmate.app.model.Game;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {

    private final ConcurrentHashMap<String, Game> games = new ConcurrentHashMap<>();

    public Game createGame() {
        String shortId = java.util.UUID.randomUUID().toString().substring(0, 8);
        Game game = new Game(shortId);
        games.put(shortId, game);
        return game;
    }

    public Game getGame(String gameId) {
        return games.get(gameId);
    }
}
