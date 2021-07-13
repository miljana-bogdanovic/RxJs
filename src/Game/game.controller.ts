import {
  BehaviorSubject,
  Observable,
  interval,
  fromEvent,
  Subject,
  from,
  iif,
  of,
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
import { EMPTY } from "rxjs";
const API_URL = "http://localhost:3000";

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
  constructor(game: Game, gameView: GameView) {
    this.game = game;
    this.gameView = gameView;
    this.createObservables();
  }

  startGame() {
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
        this.gameView.showScore(score);
      })
    );
    this.PlayerEnterPress$.subscribe((name) => {});
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
    interval: number,
    playerX: number,
    coctails: CoctailController[],
    playerController: PlayerController
  ) {
    this.gameView.clearCanvas();
    this.gameView.showScore(interval * 50);
    playerController.showPlayer(playerX, this.gameView.canvas.height - 70);
    this.gameView.showCoctails(coctails);
  }

  createObservables() {
    this.ScoreBehavior$ = new BehaviorSubject(0);
    this.HighScoreSet$ = new Subject<number>();
    this.CurrentScore$ = this.ScoreBehavior$.pipe(
      scan((prev, curr) => prev + curr),
      map((score) => {
        if (score * 50 > this.game.playerController.getPlayerHighScore())
          this.game.playerController.setPlayerHighScore(score * 50);
        return score;
      })
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
          (coctail) =>
            !(coctail.getY() > this.gameView.canvas.height) &&
            !coctail.getTouched()
        );
        return coctails;
      }),
      map((coctails: CoctailController[]) => {
        coctails.forEach((coctail: CoctailController) => {
          if (!coctail.getTouched()) coctail.setY(coctail.getY() + 50);
          else coctail.setY(coctail.getY() + 350);
        });
        return coctails;
      }),
      map((coctails) => {
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
      filter((x) => !(x > this.gameView.canvas.width - 50 || x < 50))
    );

    this.PlayerEnterPress$ = fromEvent(this.gameView.input, "keyup").pipe(
      pluck("key"),
      filter((key) => key === "Enter"),
      map(
        (value) => ({ value }),
        filter(({ value }) => value === "Enter")
      ),
      switchMap((_) => {
        return this.getPlayer(this.gameView.input.value);
      }),
      map((value) => {
        console.log(value);
        return value;
      }),
      ////filter((value)=> value!=undefined),
      ///concatMap((response)=>response===[] ? EMPTY : this.postPlayer(this.gameView.input.value)),
      map((response: { name: string; highScore: number }[]) => {
        this.gameView.hideInput();
        this.game.playerController.setPlayerName(response[0].name);
        this.game.playerController.setPlayerHighScore(response[0].highScore);
        this.HighScoreSet$.next(response[0].highScore);
        return this.gameView.input.value;
      })
    );
    //const postUser$ = this.postPlayer(this.gameView.input.value);
    this.Game$ = combineLatest([
      this.CurrentScore$,
      this.PlayerMovement$,
      this.Coctails$,
    ]).pipe(skipUntil(this.HighScoreSet$));

    this.Points$ = combineLatest([this.PlayerMovement$, this.Coctails$]);
  }

  createCoctail() {
    const cocatil = new Coctail(
      this.getRandomNumber(this.gameView.canvas.width),
      0,
      "./../" + this.getRandomNumber(4) + ".png"
    );
    const coctailView = new CoctailView(cocatil, this.gameView.ctx);
    const coctailController = new CoctailController(cocatil, coctailView);
    return [coctailController];
  }

  getPlayer(input: String): Observable<{ name: string; highScore: number }[]> {
    return from(
      fetch(`${API_URL}/players/?name=${input}`)
        .then((response) => {
          if (response.ok) return response.json();
          else throw new Error("fetch error");
        })
        .catch((er) => console.log(er))
    );
  }
  postPlayer(input: String): Observable<{ name: string; highScore: number }[]> {
    return from(
      fetch(`${API_URL}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: input,
          highScore: 0,
        }),
      })
        .then((p) => {
          if (p.ok) {
            return p.json();
          } else throw new Error("fetch error");
        })
        .catch((er) => console.log(er))
    );
    //return of([{name : '', highScore : 0}]);
  }
}
