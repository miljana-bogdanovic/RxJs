import { Player } from "./player.model";
import { PlayerView } from "./player.view";

export class PlayerController {
  constructor(private playerModel: Player, private playerView: PlayerView) {}
  showPlayer(x: number, y: number) {
    this.playerView.showPlayer(x, y);
    this.playerView.showHighScore(this.playerModel.highScore ?? 0);
  }
  setPlayerName(name: string) {
    this.playerModel.setName(name);
  }
  setPlayerHighScore(higscore: number) {
    this.playerModel.setHighScore(higscore);
    this.playerView.showHighScore(higscore);
  }

  getPlayerHighScore() {
    return this.playerModel.getHighScore();
  }
}
