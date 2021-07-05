// import css
require('./style1.css')
import { Player } from './models'


const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

document.body.appendChild(canvas)

function showScore(score : number) {
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 26px sans-serif'
    ctx.fillText(`SCORE: ${score}`, 50, 50)
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

export {
    showScore,
    clearCanvas,
    canvas
}
let p= new Player(0, 0);

export function renderGameScene( interval : number, playerX : number) {
    clearCanvas()
    showScore(interval * 10)
    p.showPlayer(ctx, playerX, canvas.height - 70 );
}