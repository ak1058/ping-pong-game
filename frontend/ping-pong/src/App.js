import React, { useEffect, useState, useRef } from "react";

const App = () => {
  const [gameState, setGameState] = useState(null);
  const [ws, setWs] = useState(null);
  const [paddle1Y, setPaddle1Y] = useState(200);
  const [paddle2Y, setPaddle2Y] = useState(200);
  const canvasRef = useRef(null); 

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setGameState(data);
    };

    return () => socket.close();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "w") {
      setPaddle1Y((prev) => Math.max(prev - 10, 0));
      ws?.send(JSON.stringify({ paddle1: Math.max(paddle1Y - 10, 0) }));
    } else if (e.key === "s") {
      setPaddle1Y((prev) => Math.min(prev + 10, 300));
      ws?.send(JSON.stringify({ paddle1: Math.min(paddle1Y + 10, 300) }));
    } else if (e.key === "ArrowUp") {
      setPaddle2Y((prev) => Math.max(prev - 10, 0));
      ws?.send(JSON.stringify({ paddle2: Math.max(paddle2Y - 10, 0) }));
    } else if (e.key === "ArrowDown") {
      setPaddle2Y((prev) => Math.min(prev + 10, 300));
      ws?.send(JSON.stringify({ paddle2: Math.min(paddle2Y + 10, 300) }));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paddle1Y, paddle2Y, ws]);

  useEffect(() => {
    if (gameState && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw paddles
      ctx.fillStyle = "blue";
      ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, 10, 100);
      ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, 10, 100);

      // Draw ball
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, 2 * Math.PI);
      ctx.fill();

      // Draw obstacles
      gameState.obstacles.forEach((obs) => {
        ctx.fillStyle = "green";
        ctx.fillRect(obs.x, obs.y, 20, 20);
      });

      // Draw scores
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.fillText(`Player 1: ${gameState.scores.player1}`, 10, 20);
      ctx.fillText(`Player 2: ${gameState.scores.player2}`, 500, 20);
    }
  }, [gameState]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width="600"
        height="400"
        style={{ border: "1px solid black" }}
      ></canvas>
      {!gameState && <p>Loading game...</p>}
    </div>
  );
};

export default App;
