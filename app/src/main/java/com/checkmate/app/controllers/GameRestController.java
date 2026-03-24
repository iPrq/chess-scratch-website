package com.checkmate.app.controllers;

import com.checkmate.app.model.Game;
import com.checkmate.app.services.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "*")
public class GameRestController {

    private final GameService gameService;

    public GameRestController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createGame() {
        Game game = gameService.createGame();
        Map<String, String> response = new HashMap<>();
        response.put("gameId", game.getGameId());
        return ResponseEntity.ok(response);
    }
}
