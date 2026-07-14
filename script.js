const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
let score = 0;
let lives = 3;

// Mover al jugador siguiendo el dedo
gameContainer.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Evita que la pantalla se desplace
    let touch = e.touches[0];
    
    // Centrar la imagen en el dedo
    let playerWidth = player.offsetWidth;
    player.style.left = (touch.clientX - playerWidth / 2) + 'px';
    
    // Cambiar a la imagen de volando
    player.src = 'assets/Gotavolando.png';
});

// Volver a imagen normal al soltar
gameContainer.addEventListener('touchend', () => {
    player.src = 'assets/Supergota.png';
});

function createObject() {
    const obj = document.createElement('img');
    const isBad = Math.random() > 0.7; 
    obj.src = isBad ? 'assets/Gotamala.png' : 'assets/Gota.png';
    obj.classList.add('falling-obj');
    
    // Posición inicial aleatoria
    obj.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    obj.style.top = '-50px';
    gameContainer.appendChild(obj);

    // Bucle de movimiento
    let pos = -50;
    let interval = setInterval(() => {
        pos += 5;
        obj.style.top = pos + 'px';

        // DETECCIÓN DE COLISIÓN (Aquí está la magia)
        const playerRect = player.getBoundingClientRect();
        const objRect = obj.getBoundingClientRect();

        if (
            objRect.top < playerRect.bottom &&
            objRect.bottom > playerRect.top &&
            objRect.left < playerRect.right &&
            objRect.right > playerRect.left
        ) {
            // Si hay contacto:
            if (!isBad) {
                score += 10;
                scoreElement.innerText = "Puntos: " + score;
            } else {
                lives--;
                document.querySelectorAll('.heart')[0].remove();
                if (lives <= 0) alert("¡Perdiste!");
            }
            obj.remove(); // Borramos el objeto al tocarlo
            clearInterval(interval);
        }

        // Si llega al fondo sin ser atrapado
        if (pos > window.innerHeight) {
            obj.remove();
            clearInterval(interval);
        }
    }, 20);
}

setInterval(createObject, 1500); // Crea una gota cada 1.5 segundos