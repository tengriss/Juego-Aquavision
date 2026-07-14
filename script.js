const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
let score = 0;
let lives = 3;

// Mover al jugador con el dedo
gameContainer.addEventListener('touchmove', (e) => {
    let touch = e.touches[0];
    player.style.left = (touch.clientX - 50) + 'px';
    player.src = 'assets/Gotavolando.png'; // Cambia imagen al moverse
});

gameContainer.addEventListener('touchend', () => {
    player.src = 'assets/Supergota.png'; // Vuelve a la normalidad
});

// Función para crear objetos que caen
function createObject() {
    const obj = document.createElement('img');
    // Alternar entre Gota y Gotamala aleatoriamente
    const isBad = Math.random() > 0.7; 
    obj.src = isBad ? 'assets/Gotamala.png' : 'assets/Gota.png';
    obj.classList.add('falling-obj');
    obj.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    gameContainer.appendChild(obj);

    // Mover objeto hacia abajo
    let pos = 0;
    let interval = setInterval(() => {
        pos += 5;
        obj.style.top = pos + 'px';

        // Detección de colisión simple
        if (pos > window.innerHeight - 150) {
            checkCollision(obj, isBad);
            clearInterval(interval);
            obj.remove();
        }
    }, 20);
}

function checkCollision(obj, isBad) {
    // Aquí iría la lógica matemática de distancia. 
    // Por simplicidad, si llega al fondo, penalizamos o sumamos.
    if (!isBad) {
        score += 10;
        document.getElementById('score').innerText = "Puntos: " + score;
    } else {
        lives--;
        const hearts = document.querySelectorAll('.heart');
        if (hearts.length > 0) hearts[0].remove();
        if (lives <= 0) alert("¡Perdiste!");
    }
}

// Crear objetos cada segundo
setInterval(createObject, 1000);