package com.checkmate.app.controllers;

import com.checkmate.app.model.Game;
import com.checkmate.app.model.Move;
import com.checkmate.app.model.ChatRequest;
import com.checkmate.app.model.ChatMessage;
import com.checkmate.app.services.ChessLogicService;
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
    private final ChessLogicService chessLogicService;
    private final SimpMessagingTemplate messagingTemplate;

    public GameController(GameService gameService, ChessLogicService chessLogicService, SimpMessagingTemplate messagingTemplate) {
        this.gameService = gameService;
        this.chessLogicService = chessLogicService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/join/{gameId}")
    public void join(@DestinationVariable String gameId,
                     @Header("simpSessionId") String sessionId,
                     @Payload java.util.Map<String, String> payload) {

        String playerId = payload != null ? payload.getOrDefault("playerId", sessionId) : sessionId;

        Game game = gameService.getGame(gameId);
        if (game == null) {
            messagingTemplate.convertAndSend("/queue/player/" + playerId + "/error", "Game not found");
            return;
        }


        if (game.getPlayers().size() >= 2 && !game.getPlayers().contains(playerId)) {
            messagingTemplate.convertAndSend(
                    "/queue/player/" + playerId + "/error",
                    "Game is full"
            );
            return;
        }

        if (!game.getPlayers().contains(playerId)) {
            game.getPlayers().add(playerId);
        }

        String color = game.getPlayers().indexOf(playerId) == 0 ? "white" : "black";

        messagingTemplate.convertAndSend(
                "/queue/player/" + playerId + "/color",
                color
        );

        if (game.getCurrentLegalMoves().isEmpty() && game.getMoveHistory().isEmpty() && !game.getStatus().isGameOver()) {
            chessLogicService.updateCurrentLegalMoves(game);
        }

        messagingTemplate.convertAndSend(
                "/topic/game/" + gameId,
                game
        );
    }

    @MessageMapping("/move")
    public void move(@Payload Move move) {

        Game game = gameService.getGame(move.getGameid());

        if (game == null) return;

        boolean success = chessLogicService.applyMove(game, move);

        if (success) {
            messagingTemplate.convertAndSend(
                    "/topic/game/" + move.getGameid(),
                    game
            );
        }
    }

    @MessageMapping("/chat")
    public void chat(@Payload ChatRequest request) {
        Game game = gameService.getGame(request.getGameId());
        if (game == null) return;
        
        String color = "Spectator";
        if (game.getPlayers().size() > 0 && game.getPlayers().get(0).equals(request.getPlayerId())) {
            color = "White";
        } else if (game.getPlayers().size() > 1 && game.getPlayers().get(1).equals(request.getPlayerId())) {
            color = "Black";
        }
        
        ChatMessage msg = new ChatMessage(color, request.getText(), System.currentTimeMillis());
        game.getChatMessages().add(msg);
        
        messagingTemplate.convertAndSend("/topic/game/" + request.getGameId(), game);
    }

    @MessageMapping("/action")
    public void handleAction(@Payload com.checkmate.app.model.GameActionRequest request) {
        Game game = gameService.getGame(request.getGameId());
        if (game == null || game.getStatus().isGameOver()) return;

        com.checkmate.app.model.Color requestingColor = null;
        if (game.getPlayers().size() > 0 && game.getPlayers().get(0).equals(request.getPlayerId())) {
            requestingColor = com.checkmate.app.model.Color.WHITE;
        } else if (game.getPlayers().size() > 1 && game.getPlayers().get(1).equals(request.getPlayerId())) {
            requestingColor = com.checkmate.app.model.Color.BLACK;
        }

        if (requestingColor == null) return; // Only players can perform actions

        switch (request.getAction()) {
            case "RESIGN":
                game.getStatus().setGameOver(true);
                game.getStatus().setWinner(requestingColor == com.checkmate.app.model.Color.WHITE ? com.checkmate.app.model.Color.BLACK : com.checkmate.app.model.Color.WHITE);
                break;
            case "OFFER_DRAW":
                game.getStatus().setDrawOfferedByColor(requestingColor);
                break;
            case "ACCEPT_DRAW":
                if (game.getStatus().getDrawOfferedByColor() != null && game.getStatus().getDrawOfferedByColor() != requestingColor) {
                    game.getStatus().setGameOver(true);
                    game.getStatus().setDraw(true);
                    game.getStatus().setDrawOfferedByColor(null);
                }
                break;
            case "DECLINE_DRAW":
                if (game.getStatus().getDrawOfferedByColor() != null && game.getStatus().getDrawOfferedByColor() != requestingColor) {
                    game.getStatus().setDrawOfferedByColor(null);
                }
                break;
        }

        messagingTemplate.convertAndSend("/topic/game/" + request.getGameId(), game);
    }
}
