import { GameContoller } from "./Game/game.controller";
import { Game } from "./Game/game.model";
import { GameView } from "./Game/game.view";

const gameView = new GameView();
const game = new Game(gameView.canvas);
const gameContoller = new GameContoller(game, gameView);
gameContoller.startGame();

