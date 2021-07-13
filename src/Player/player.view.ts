import { Player } from "./player.model";

export class PlayerView {
  canvasForImage: CanvasRenderingContext2D;
  player: Player;

  constructor(player: Player, ctx: CanvasRenderingContext2D) {
    this.player = player;
    this.canvasForImage = ctx;
  }
  showPlayer(x: number, y: number) {
    var thumbImg = document.createElement("img");
    thumbImg.setAttribute("class", "player");
    thumbImg.src = "./../beach girl happy.png";
    thumbImg.onload = () => {
      this.canvasForImage.drawImage(thumbImg, x, y - 120, 200, 200);
    };
  }
  showHighScore(score: number) {
    this.canvasForImage.fillStyle = "#000000";
    this.canvasForImage.font = "bold 26px sans-serif";
    this.canvasForImage.fillText(`Highscore: ${score}`, 200, 50);

}
}
