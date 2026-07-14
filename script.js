const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const livesContainer = document.getElementById('lives');

let score = 0;
let lives = 3;

function resetGame() {
    score = 0;
    lives = 3;
    scoreElement.innerText = "Puntos: 0";
    livesContainer.innerHTML = '<img src="assets/Corazon.png" class="heart"><img src="assets/Corazon.png" class="heart"><img src="assets/Corazon.png" class="heart">';
}

// Movimiento táctil
gameContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
    let touch = e.touches[0];
    let playerWidth = player.offsetWidth;
    let newX = touch.clientX - (playerWidth / 2);
    
    if (newX < 0) newX = 0;
    if (newX > window.innerWidth - playerWidth) newX = window.innerWidth - playerWidth;
    
    player.style.left = newX + 'px';
    player.style.transform = 'none'; 
    player.src = 'assets/Gotavolando.png';
}, { passive: false });

gameContainer.addEventListener('touchend', () => {
    player.src = 'assets/Supergota.png';
});

function createObject() {
    const obj = document.createElement('img');
    const random = Math.random();
    
    if (random < 0.3) {
        obj.src = 'assets/Gotamala.png';
        obj.dataset.type = 'mala';
    } else if (random < 0.65) {
        obj.src = 'assets/Gota.png';
        obj.dataset.type = 'buena';
    } else {
        obj.src = 'assets/Balon.png';
        obj.dataset.type = 'buena';
    }
    
    obj.classList.add('falling-obj');
    // Posición inicial
    obj.style.left = (Math.random() * (window.innerWidth - 60)) + 'px';
    obj.style.top = '-60px'; // Usamos px en lugar de vw
    gameContainer.appendChild(obj);

    let pos = -60;
    // Aumentamos velocidad a 8px por intervalo para que sea fluida
    let fall = setInterval(() => {
        pos += 8; 
        obj.style.top = pos + 'px';

        const pRect = player.getBoundingClientRect();
        const oRect = obj.getBoundingClientRect();

        // Detectar colisión (margen reducido para mejor experiencia)
        if (oRect.bottom > pRect.top + 20 && 
            oRect.top < pRect.bottom && 
            oRect.right > pRect.left + 20 && 
            oRect.left < pRect.right - 20) {
            
            if (obj.dataset.type === 'buena') {
                score += obj.src.includes('Balon.png') ? 20 : 10;
                scoreElement.innerText = "Puntos: " + score;
            } else {
                lives--;
                if(livesContainer.firstElementChild) livesContainer.firstElementChild.remove();
                if (lives <= 0) {
                    alert("¡Game Over! Puntos totales: " + score);
                    resetGame();
                }
            }
            obj.remove();
            clearInterval(fall);
        }

        // Eliminar si sale de pantalla
        if (pos > window.innerHeight) { 
            obj.remove(); 
            clearInterval(fall); 
        }
    }, 20);
}

setInterval(createObject, 1200);