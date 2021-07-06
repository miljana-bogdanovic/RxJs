export class Player {
  constructor(public x: number, public y: number) {}
  
  showPlayer(ctx: CanvasRenderingContext2D, x : number , y : number) {

    var thumbImg = document.createElement("img");
    thumbImg.setAttribute('class', 'player');
    thumbImg.src = "./../beach girl happy.png";
    thumbImg.onload = function () {
      ctx.drawImage(thumbImg, x, y-120, 200, 200);
    };

  }
  
}
export class Coctail {
  x : number;
  y : number;
  radius : number;
  public touched : boolean=false;
}