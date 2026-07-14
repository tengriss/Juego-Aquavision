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

// Movimiento mejorado para móviles
gameContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
    let touch = e.touches[0];
    let playerWidth = player.offsetWidth;
    
    // Calcular posición X asegurando límites
    let newX = touch.clientX - (playerWidth / 2);
    if (newX < 0) newX = 0;
    if (newX > window.innerWidth - playerWidth) newX = window.innerWidth - playerWidth;
    
    player.style.left = newX + 'px';
    player.style.transform = 'none'; // Quitar el transform para que el left funcione bien
    player.src = 'assets/Gotavolando.png';
}, { passive: false });

gameContainer.addEventListener('touchend', () => {
    player.src = 'assets/Supergota.png';
});

function createObject() {
    const obj = document.createElement('img');
    const random = Math.random();
    
    // 30% mala, 35% Gota, 35% Balón
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
    obj.style.left = (Math.random() * (window.innerWidth - 80)) + 'px';
    obj.style.top = '-80px';
    gameContainer.appendChild(obj);

    let pos = -80;
    let fall = setInterval(() => {
        pos += 5;
        obj.style.top = pos + 'px';

        const pRect = player.getBoundingClientRect();
        const oRect = obj.getBoundingClientRect();

        if (oRect.bottom > pRect.top && oRect.top < pRect.bottom && oRect.right > pRect.left && oRect.left < pRect.right) {
            if (obj.dataset.type === 'buena') {
                score += 10;
                scoreElement.innerText = "Puntos: " + score;
            } else {
                lives--;
                if(livesContainer.firstElementChild) livesContainer.firstElementChild.remove();
                if (lives <= 0) {
                    alert("¡Game Over! Puntos: " + score);
                    resetGame();
                }
            }
            obj.remove();
            clearInterval(fall);
        }

        if (pos > window.innerHeight) {
            obj.remove();
            clearInterval(fall);
        }
    }, 20);
}

setInterval(createObject, 1500);