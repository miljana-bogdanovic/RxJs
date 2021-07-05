import { combineLatest, fromEvent, interval, merge, Observable } from 'rxjs'
import { filter, map, pluck, scan, startWith } from 'rxjs/operators'

import { canvas, renderGameScene } from './view'

// OBSERVABLE CONSTANTS
const ScoreInterval$ = interval(1000)

const PlayerMovement$ = 
    merge(fromEvent(document, 'keyup'), fromEvent(document, 'keydown')). pipe(
    pluck('key')
    ,filter(key => key === 'ArrowLeft' || key === 'ArrowRight')
    ,scan((prevX, key) => prevX + (key === 'ArrowLeft' ? -10 : 10), canvas.width/2)
    ,startWith(canvas.width/2)
);


const Game$ = combineLatest(
    ScoreInterval$, PlayerMovement$,
   
).pipe(
    map (
        (interval) => {return interval}
    )
).subscribe((interval) => {
     renderGameScene(interval[0], interval[1])
    //console.log(interval[0], interval[1])
})
