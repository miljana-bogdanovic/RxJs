import {
  BehaviorSubject,
  Observable,
  interval,
  fromEvent,
  Subject,
  from,
  iif,
  of,
  empty,
} from "rxjs";
import {
  concatMap,
  filter,
  map,
  mergeMap,
  pluck,
  scan,
  share,
  skip,
  skipUntil,
  startWith,
  switchMap,
  take,
  takeWhile,
  tap,
} from "rxjs/operators";
import { combineLatest, merge } from "rxjs";
import { CoctailController } from "../Coctail/coctail.controller";
import { CoctailView } from "../Coctail/coctail.view";
import { PlayerController } from "../Player/player.controller";
import { Player } from "../Player/player.model";
import { Game } from "./game.model";
import { GameView } from "./game.view";
import { Coctail } from "../Coctail/coctail.model";

import { getPlayer, postPlayer, putPlayerHighScore } from "../services/service";

export class GameContoller {
  game: Game;
  gameView: GameView;
  canvas: HTMLCanvasElement;
  ScoreBehavior$: BehaviorSubject<number>;
  CurrentScore$: Observable<number>;
  CoctailCreator$: Observable<CoctailController[]>;
  Coctails$: Observable<CoctailController[]>;
  PlayerMovement$: Observable<number>;
  Game$: Observable<[number, number, CoctailController[]]>;
  Points$: Observable<[number, CoctailController[]]>;
  PlayerEnterPress$: Observable<string>;
  HighScoreSet$: Subject<number>;
  NewGame$: Observable<void>;
  IsAlive$: BehaviorSubject<boolean>;

  constructor(game: Game, gameView: GameView) {
    this.game = game;
    this.gameView = gameView;
    this.IsAlive$ = new BehaviorSubject(true);
    this.ScoreBehavior$ = new BehaviorSubject(0);
    this.HighScoreSet$ = new Subject<number>();
    this.createObservables();
  }

  startGame() {
    this.IsAlive$.next(true);
    this.Game$.subscribe((interval) => {
      this.renderGameScene(
        interval[0],
        interval[1],
        interval[2],
        this.game.playerController
      );
    });

    this.Points$.subscribe((points) => {
      let score = this.detectCollision(
        points[1],
        new Player(points[0], this.gameView.canvas.height - 70)
      );
      this.ScoreBehavior$.next(score);
    });

    this.CurrentScore$.pipe(
      map((score) => {
        this.game.score = score;
        console.log(this.game.score);
        this.gameView.showScore(score);
      })
    );
    this.PlayerEnterPress$.subscribe((name) => {});
    this.NewGame$.subscribe();
  }

  detectCollision(coctails: CoctailController[], player: Player) {
    let score = 0;
    coctails.forEach((coctail: CoctailController) => {
      if (this.isCollision(coctail, player)) {
        score++;
        coctail.setTouched(true);
      }
    });
    return score;
  }

  isCollision(coctail: CoctailController, player: Player) {
    return (
      coctail.getX() > player.x &&
      coctail.getX() + 100 < player.x + 200 &&
      coctail.getY() > player.y - 50 &&
      !coctail.getTouched()
    );
  }

  getRandomNumber(range: number) {
    return parseInt((Math.random() * range).toFixed(0));
  }

  renderGameScene(
    scoreCount: number,
    playerX: number,
    coctails: CoctailController[],
    playerController: PlayerController
  ) {
    this.gameView.clearCanvas();
    this.gameView.showScore(scoreCount * 50);
    playerController.showPlayer(playerX, this.gameView.canvas.height - 70);
    this.gameView.showCoctails(coctails);
  }

  createObservables() {
    this.NewGame$ = fromEvent(this.gameView.button, "click").pipe(
      map(() => this.saveHighScoreAndRestart())
    );

    this.CurrentScore$ = this.ScoreBehavior$.pipe(
      scan((prev, curr) => prev + curr)
    );
    this.CoctailCreator$ = interval(1000).pipe(
      map((_) => this.createCoctail())
    );

    this.Coctails$ = this.CoctailCreator$.pipe(
      scan(
        (
          coctails: CoctailController[],
          coctail: CoctailController[]
        ): CoctailController[] => {
          return [...coctails].concat(coctail);
        }
      ),
      map((coctails) => {
        coctails.filter(
          (coctail) => !(coctail.getY() > this.gameView.canvas.height)
        );
        coctails.forEach((coctail: CoctailController) => {
          !coctail.getTouched()
            ? coctail.setY(coctail.getY() + 50)
            : coctail.setY(coctail.getY() + 350);
        });
        coctails.filter((coctail) => !coctail.getTouched());
        return coctails;
      }),

      share()
    );

    this.PlayerMovement$ = merge(
      fromEvent(document, "keyup"),
      fromEvent(document, "keydown")
    ).pipe(
      pluck("key"),
      filter((key) => key === "ArrowLeft" || key === "ArrowRight"),
      scan(
        (prevX, key) => prevX + (key === "ArrowLeft" ? -10 : 10),
        this.gameView.canvas.width / 2
      ),
      startWith(this.gameView.canvas.width / 2),
      filter((x) => !(x > this.gameView.canvas.width - 10 || x < 10))
    );

    this.PlayerEnterPress$ = fromEvent(this.gameView.input, "keyup").pipe(
      pluck("key"),
      filter((key) => key === "Enter"),
      switchMap((_) => {
        return getPlayer(this.gameView.input.value);
      }),
      switchMap((response: { name: string; highScore: number }[]) => {
        if (response)
          return response.length > 0
            ? of(response)
            : of(postPlayer(this.gameView.input.value));
      }),
      map((response: { name: string; highScore: number; id: string }[]) => {
        this.userEntered(response[0]);
        return this.gameView.input.value;
      })
    );

    this.Game$ = combineLatest([
      this.CurrentScore$,
      this.PlayerMovement$,
      this.Coctails$,
    ]).pipe(
      skipUntil(this.HighScoreSet$),
      takeWhile(() => this.IsAlive$.value)
    );

    this.Points$ = combineLatest([this.PlayerMovement$, this.Coctails$]).pipe(
      takeWhile(() => this.IsAlive$.value)
    );
  }

  createCoctail() {
    const cocatil = new Coctail(
      this.getRandomNumber(this.gameView.canvas.width),
      0,
      "./../resources/" + this.getRandomNumber(4) + ".png"
    );
    const coctailView = new CoctailView(cocatil, this.gameView.ctx);
    const coctailController = new CoctailController(cocatil, coctailView);
    return [coctailController];
  }
  saveHighScoreAndRestart() {
    if (this.game.playerController.getPlayerHighScore() == this.game.score) {
      putPlayerHighScore(
        this.game.playerController.getPlayerHighScore(),
        this.game.playerController.getPlayerID(),
        this.game.playerController.getPlayerName()
      );
    }
    this.gameView.clearCanvas();
    this.IsAlive$.next(false);
    this.gameView.showEnd(this.game.playerController.getPlayerHighScore());
    this.gameView.hideButton();
  }
  userEntered(response: { name: string; highScore: number; id: string }) {
    this.game.playerController.setPlayerName(response.name);
    this.game.playerController.setPlayerID(response.id);
    this.gameView.hideInput();
    this.game.playerController.setPlayerName(response.name);
    this.game.playerController.setPlayerHighScore(response.highScore);
    this.HighScoreSet$.next(response.highScore);
    this.gameView.addEndButton();
  }
}
