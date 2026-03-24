package com.checkmate.app.controllers;

import com.checkmate.app.model.Game;
import com.checkmate.app.model.Move;
import com.checkmate.app.model.Piece;
import com.checkmate.app.services.GameService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class GameController {

    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate;

    public GameController(GameService gameService, SimpMessagingTemplate messagingTemplate) {
        this.gameService = gameService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/join/{gameId}")
    public void join(@DestinationVariable String gameId,
                     @Header("simpSessionId") String sessionId) {

        Game game = gameService.getOrCreateGame(gameId);


        if (game.getPlayers().size() >= 2) {
            messagingTemplate.convertAndSendToUser(
                    sessionId,
                    "/queue/error",
                    "Game is full"
            );
            return;
        }

        game.getPlayers().add(sessionId);

        String color = game.getPlayers().size() == 1 ? "white" : "black";

        messagingTemplate.convertAndSendToUser(
                sessionId,
                "/queue/color",
                color
        );
    }
    @MessageMapping("/move")
    public void move(@Payload Move move) {

        Game game = gameService.getGame(move.getGameid());

        if (game == null) return;

        applyMove(game, move);
        
        messagingTemplate.convertAndSend(
                "/topic/game/" + move.getGameid(),
                game
        );
    }

    private void applyMove(Game game, Move move) {
        Piece[][] board = game.getBoard();

        Piece piece = board[move.getFromRow()][move.getFromCol()];

        board[move.getToRow()][move.getToCol()] = piece;
        board[move.getFromRow()][move.getFromCol()] = null;

        game.switchTurn();
    }
}
