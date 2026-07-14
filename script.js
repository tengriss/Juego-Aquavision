const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const livesContainer = document.getElementById('lives');

let score = 0;
let lives = 3;

// Función para reiniciar el juego
function resetGame() {
    score = 0;
    lives = 3;
    scoreElement.innerText = "Puntos: 0";
    
    // Reiniciar corazones visualmente
    livesContainer.innerHTML = '';
    for(let i = 0; i < 3; i++) {
        const img = document.createElement('img');
        img.src = 'assets/Corazon.png';
        img.classList.add('heart');
        livesContainer.appendChild(img);
    }
}

// Mover al jugador siguiendo el dedo
gameContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
    let touch = e.touches[0];
    let playerWidth = player.offsetWidth;
    
    // Mueve el jugador a la posición del dedo
    player.style.left = (touch.clientX - playerWidth / 2) + 'px';
    player.src = 'assets/Gotavolando.png';
}, { passive: false });

// Volver a imagen normal al soltar
gameContainer.addEventListener('touchend', () => {
    player.src = 'assets/Supergota.png';
});

// Función principal para crear objetos (Gota vs Gotamala)
function createObject() {
    const obj = document.createElement('img');
    const isBad = Math.random() > 0.7; // 30% de probabilidad de que sea mala
    obj.src = isBad ? 'assets/Gotamala.png' : 'assets/Gota.png';
    obj.classList.add('falling-obj');
    
    // Posición inicial aleatoria en X
    obj.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    obj.style.top = '-60px';
    gameContainer.appendChild(obj);

    // Movimiento de caída
    let pos = -60;
    let fallInterval = setInterval(() => {
        pos += 5; // Velocidad de caída
        obj.style.top = pos + 'px';

        // Detección de colisión (cálculo de rectángulos)
        const playerRect = player.getBoundingClientRect();
        const objRect = obj.getBoundingClientRect();

        if (
            objRect.bottom > playerRect.top &&
            objRect.top < playerRect.bottom &&
            objRect.right > playerRect.left &&
            objRect.left < playerRect.right
        ) {
            // Acción al tocar
            if (!isBad) {
                score += 10;
                scoreElement.innerText = "Puntos: " + score;
            } else {
                lives--;
                const hearts = document.querySelectorAll('.heart');
                if (hearts.length > 0) hearts[0].remove();
                
                if (lives <= 0) {
                    alert("¡Game Over! Puntuación final: " + score);
                    resetGame();
                }
            }
            obj.remove();
            clearInterval(fallInterval);
        }

        // Si el objeto llega al fondo sin ser tocado
        if (pos > window.innerHeight) {
            obj.remove();
            clearInterval(fallInterval);
        }
    }, 20);
}

// Generar un objeto nuevo cada 1 segundo
setInterval(createObject, 1000);