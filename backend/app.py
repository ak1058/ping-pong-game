from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import random
import asyncio

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


game_state = {
    "paddle1": {"x": 10, "y": 200},
    "paddle2": {"x": 580, "y": 200},
    "ball": {"x": 300, "y": 200, "vx": 3, "vy": 3},
    "obstacles": [{"x": random.randint(100, 500), "y": random.randint(100, 300)} for _ in range(2)],
    "scores": {"player1": 0, "player2": 0},
}

clients = []


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            if "paddle1" in data:
                game_state["paddle1"]["y"] = data["paddle1"]
            elif "paddle2" in data:
                game_state["paddle2"]["y"] = data["paddle2"]

            
            for client in clients:
                await client.send_json(game_state)

    except WebSocketDisconnect:
        clients.remove(websocket)


async def update_ball():
    while True:
        ball = game_state["ball"]
        ball["x"] += ball["vx"]
        ball["y"] += ball["vy"]

        
        if ball["y"] <= 0 or ball["y"] >= 400:
            ball["vy"] *= -1

        
        if (
            ball["x"] <= game_state["paddle1"]["x"] + 10
            and game_state["paddle1"]["y"] <= ball["y"] <= game_state["paddle1"]["y"] + 100
        ) or (
            ball["x"] >= game_state["paddle2"]["x"] - 10
            and game_state["paddle2"]["y"] <= ball["y"] <= game_state["paddle2"]["y"] + 100
        ):
            ball["vx"] *= -1

        
        for obs in game_state["obstacles"]:
            if obs["x"] <= ball["x"] <= obs["x"] + 20 and obs["y"] <= ball["y"] <= obs["y"] + 20:
                ball["vx"] *= -1
                ball["vy"] *= -1

       
        if ball["x"] <= 0:
            game_state["scores"]["player2"] += 1
            reset_ball()
        elif ball["x"] >= 600:
            game_state["scores"]["player1"] += 1
            reset_ball()

       
        for client in clients:
            await client.send_json(game_state)

        await asyncio.sleep(0.05)


def reset_ball():
    game_state["ball"] = {"x": 300, "y": 200, "vx": random.choice([-3, 3]), "vy": random.choice([-3, 3])}



@app.on_event("startup")
async def startup_event():
    asyncio.create_task(update_ball())
