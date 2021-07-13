
import { PlayerController } from "../Player/player.controller";
import { Player } from "../Player/player.model";
import { PlayerView } from "../Player/player.view";


export class Game{
    playerController : PlayerController;


     constructor( 
        ctx : HTMLCanvasElement
        ) {
            const player = new Player(0, 0);
            const playerView = new PlayerView(player, ctx.getContext('2d'));
            this.playerController = new PlayerController(player, playerView);
        }


  


}