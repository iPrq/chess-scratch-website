package com.checkmate.app.services;

import com.checkmate.app.model.Game;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {

    private final ConcurrentHashMap<String, Game> games = new ConcurrentHashMap<>();

    public Game getOrCreateGame(String gameId) {
        return games.computeIfAbsent(gameId, Game::new);
    }

    public Game getGame(String gameId) {
        return games.get(gameId);
    }
}
