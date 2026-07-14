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

// Movimiento táctil mejorado
gameContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
    let touch = e.touches[0];
    let playerWidth = player.offsetWidth;
    let newX = touch.clientX - (playerWidth / 2);
    
    // Límites de pantalla
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
    
    // Probabilidades
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
    obj.style.left = (Math.random() * (window.innerWidth - 60)) + 'px';
    obj.style.top = '-80px';
    gameContainer.appendChild(obj);

    let pos = -80;
    
    let fall = setInterval(() => {
        pos += 7; // Velocidad de caída
        obj.style.top = pos + 'px';

        const pRect = player.getBoundingClientRect();
        const oRect = obj.getBoundingClientRect();

        // HITBOX ESTRECHA:
        // Aumentamos los márgenes laterales (+40 / -40) para que el impacto sea más preciso
        // Ajustamos pRect.top + 40 para que sea un poco más abajo y no detecte "fantasmas" arriba
        const isHit = (oRect.bottom > pRect.top + 40) && 
                      (oRect.top < pRect.bottom) && 
                      (oRect.right > pRect.left + 40) && 
                      (oRect.left < pRect.right - 40);

        if (isHit) {
            if (obj.dataset.type === 'buena') {
                // Balón = 20 pts, Gota = 10 pts
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

        // Eliminar si pasa de la pantalla
        if (pos > window.innerHeight) { 
            obj.remove(); 
            clearInterval(fall); 
        }
    }, 20);
}

// Genera objetos cada 1.2 segundos
setInterval(createObject, 1200);