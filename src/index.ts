import { BehaviorSubject, combineLatest, fromEvent, interval, merge, Observable } from 'rxjs'
import { filter, map, pluck, scan, startWith, share } from 'rxjs/operators'
import { canvas, renderGameScene,  detectCollision, createCoctail, showScore } from './view'
import { Player, Coctail } from './models'


const ScoreBehavior$ : BehaviorSubject<number>= new BehaviorSubject(0);
const CurrentScore$ : Observable<number>= ScoreBehavior$.pipe(scan((prev, curr) => prev + curr));
const CoctailCreator$ = interval(2500).pipe(map(_ => createCoctail()));

const Coctails$ = CoctailCreator$
    .pipe(
        scan(
            (coctails :Coctail[], coctail : Coctail[]) : Coctail[] => {return [...coctails].concat(coctail)}),
        map ( (coctails) => {
            coctails.filter( (coctail) => !(coctail.y > canvas.height) && !coctail.touched);
        return coctails;
        }),
        map((coctails : Coctail[]) => {
            coctails.forEach((coctail : Coctail )=> {
                if (!coctail.touched)
                coctail.y += 80;
                else coctail.y+=250;
        });
        return coctails;
    }),
    map ( (coctails) => {
        coctails.filter( (coctail) => !(coctail.touched));
    return coctails;
    }),
    share());


const PlayerMovement$ =   merge(fromEvent(document, 'keyup'), fromEvent(document, 'keydown')). pipe(
    pluck('key')
    ,filter(key => key === 'ArrowLeft' || key === 'ArrowRight')
    ,scan((prevX, key) => prevX + (key === 'ArrowLeft' ? -10 : 10), canvas.width/2)
    ,startWith(canvas.width/2)
    ,filter(x => !(x > canvas.width - 50 || x < 50))
);




const Game$ = combineLatest(
    [CurrentScore$, PlayerMovement$,  Coctails$]
   
);
const Points$ = combineLatest(
    [PlayerMovement$,
    Coctails$]
);

function startGame() {
    Game$.subscribe((interval) => {
        renderGameScene(interval[0], interval[1], interval[2])
   });
   
   Points$.subscribe(points=> { 
    let score= detectCollision(points[1], new Player(points[0], canvas.height-70));
   ScoreBehavior$.next(score);
 })
   
    CurrentScore$.pipe(map((score)=> {
        showScore(score)
    }))

}


startGame()