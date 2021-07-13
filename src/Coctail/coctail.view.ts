import { Coctail } from "./coctail.model";

export class CoctailView {
  constructor(public coctail: Coctail, public ctx: CanvasRenderingContext2D) {}
  showCoctail() {
    var thumbImg = document.createElement("img");
    thumbImg.setAttribute("class", "image");
    thumbImg.src = this.coctail.image;
    thumbImg.onload = () => {
      this.ctx.drawImage(
        thumbImg,
        this.coctail.x,
        this.coctail.y - 220,
        100,
        100
      );
    };
  }
}
