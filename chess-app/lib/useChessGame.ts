"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { GameState, GameStatus, Color } from "./chessLogic"; // Re-using types if possible, or we will need to define them.
import { backendUrl } from "./backend";

export type Point = [number, number];

export interface BackendGame {
  gameId: string;
  players: string[];
  board: any[][];
  turn: "WHITE" | "BLACK";
  status: any;
  lastMove?: any;
  moveHistory?: any[];
  chatMessages?: any[];
  currentLegalMoves?: any[];
}

export function useChessGame(gameId: string | null) {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  const [backendGame, setBackendGame] = useState<BackendGame | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!gameId) return;

    let playerId = "unknown";
    if (typeof window !== "undefined") {
      playerId = sessionStorage.getItem("chessPlayerId") || "";
      if (!playerId) {
        playerId = Math.random().toString(36).substring(2, 10);
        sessionStorage.setItem("chessPlayerId", playerId);
      }
    }

    const socket = new SockJS(backendUrl("/ws"));
    const client = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function (frame) {
      setConnected(true);
      // Listen for game state updates
      client.subscribe(`/topic/game/${gameId}`, (message) => {
        if (message.body) {
          const gameUpdate = JSON.parse(message.body);
          setBackendGame(gameUpdate);
        }
      });

      // Listen for errors
      client.subscribe(`/queue/player/${playerId}/error`, (message) => {
        if (message.body) {
          setError(message.body);
        }
      });

      // Listen for color assignment
      client.subscribe(`/queue/player/${playerId}/color`, (message) => {
        if (message.body) {
          setPlayerColor(message.body as Color);
        }
      });

      // Send join message
      client.publish({
        destination: `/app/join/${gameId}`,
        body: JSON.stringify({ playerId }),
      });
    };

    client.onStompError = function (frame) {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
      setError("Connection error");
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
      setConnected(false);
    };
  }, [gameId]);

  const makeMove = useCallback(
    (fromRow: number, fromCol: number, toRow: number, toCol: number, promotionPiece?: string) => {
      if (stompClient && stompClient.connected && gameId) {
        stompClient.publish({
          destination: "/app/move",
          body: JSON.stringify({
            gameid: gameId,
            fromRow,
            fromCol,
            toRow,
            toCol,
            promotionPiece,
          }),
        });
      }
    },
    [stompClient, gameId]
  );

  const sendChatMessage = useCallback(
    (text: string) => {
      let playerId = "unknown";
      if (typeof window !== "undefined") {
        playerId = sessionStorage.getItem("chessPlayerId") || "";
      }
      if (stompClient && stompClient.connected && gameId) {
        stompClient.publish({
          destination: "/app/chat",
          body: JSON.stringify({
            gameId,
            playerId,
            text,
          }),
        });
      }
    },
    [stompClient, gameId]
  );

  const sendAction = useCallback(
    (action: "RESIGN" | "OFFER_DRAW" | "ACCEPT_DRAW" | "DECLINE_DRAW") => {
      let playerId = "unknown";
      if (typeof window !== "undefined") {
        playerId = sessionStorage.getItem("chessPlayerId") || "";
      }
      if (stompClient && stompClient.connected && gameId) {
        stompClient.publish({
          destination: "/app/action",
          body: JSON.stringify({
            gameId,
            playerId,
            action,
          }),
        });
      }
    },
    [stompClient, gameId]
  );

  return { playerColor, backendGame, error, connected, makeMove, sendChatMessage, sendAction };
}
