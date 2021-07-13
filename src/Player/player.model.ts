export class Player {
  constructor(
    public x: number,
    public y: number,
    public name: string = "",
    public highScore: number = 0
  ) {

  }
  setName(value : string){
      this.name=value;
  }
  setHighScore(value : number){
      this.highScore=value;
  }
  getHighScore(){
    return this.highScore;
}
}
