import { CoctailController } from "../Coctail/coctail.controller";

require("./../style1.css");

export class GameView {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  input: HTMLInputElement;

  constructor() {
    this.createCanvas();
  }
  createCanvas() {
    this.canvas = document.createElement("canvas");

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.input = document.createElement("input");
    this.input.setAttribute("class", "user-input");
    this.input.setAttribute("placeholder", "Enter username");

    document.body.appendChild(this.input);

    this.input.focus();
  }

  showScore(score: number) {
    this.ctx.fillStyle = "#000000";
    this.ctx.font = "bold 26px sans-serif";
    this.ctx.fillText(`Score: ${score}`, 50, 50);
  }

  hideInput() {
    this.input.setAttribute("class", "hidden");
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  showCoctails(coctails: CoctailController[]) {
    coctails.forEach(function (coctail: CoctailController) {
      coctail.showCoctail();
    });
  }
  clearInput() {
    this.input.value = "";
  }
}
