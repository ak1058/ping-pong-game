# Ping-Pong Game

Welcome to the Ping-Pong game repository! This is a simple two-player game where players can control paddles to hit a ball back and forth.

- **Player 1** can move their paddle using the `W` and `S` keys.
- **Player 2** can move their paddle using the `Arrow Up` and `Arrow Down` keys.


---

## Backend Setup (app.py)

The backend of this game is built using Python. It handles the game logic, scorekeeping, and game state management.

### Dependencies:

To run the backend, you need the following Python packages:

- `Flask`
- `Flask-SocketIO`
- `pygame` (optional, for game logic or sound effects)

These dependencies can be installed by creating a virtual environment and running the following command:

```bash
pip install -r requirements.txt
```bash

## Running the backend:

by this cmd
```bash
uvicorn app:app --reload
```bash

## Frontend part
go to the frontend/ping-pong directory
you can install dependencies by
```bash
npm install

and it can be run by
```bash
npm start


## Game controls
player 1 can be controlled by "W" and "S" keys
player 2 can be controlled by "Arrow Up" and "Arrow down" keys
