require('./style1.css')
import { Coctail, Player } from './models'


const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);

function showScore(score : number) {
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`Score: ${score}`, 50, 50);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export {
    showScore,
    clearCanvas,
    canvas,
    showCoctails,
    detectCollision,
    createCoctail,
    renderGameScene
}
let p= new Player(0, 0);

function renderGameScene( interval : number, playerX : number, coctails :Coctail[]) {
    clearCanvas();
    showScore(interval * 50);
    p.showPlayer(ctx, playerX, canvas.height - 70 );
    showCoctails(coctails);
}

function showCoctails(coctails :Coctail[] ) {
    const startAngle = 0 * (Math.PI / 180)
    const endAngle = 360 * (Math.PI / 180)

    ctx.strokeStyle = '#000000'
    ctx.fillStyle = '#000000'
    ctx.lineWidth = 1

    coctails.forEach((coctail : Coctail) => {
        ctx.beginPath()
        ctx.arc(coctail.x, coctail.y, coctail.radius, startAngle, endAngle, false)
        ctx.fill()
        ctx.stroke()
    })
}

function detectCollision(coctails : Coctail[], player : Player) {
   let score=0;
   coctails.forEach((coctail : Coctail)=>{ if (isCollision(coctail, player)) {
        score++;
        coctail.touched=true;
    }}
     )
     return score;
}

function isCollision(coctail : Coctail, player : Player) {
    return (coctail.x >player.x  && coctail.x < player.x + 150) && (coctail.y > player.y - 150 && coctail.y < player.y) && !coctail.touched;
}
function createCoctail() {
    return [{
        x: getRandomNumber(canvas.width),
        y: 0,
        radius: 20
    }]
}
function getRandomNumber(range : number) {
    return parseInt((Math.random() * range).toFixed(0))
}
