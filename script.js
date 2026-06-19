const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const gridSize = 20; // Tamaño de cada cuadrícula (20x20 píxeles)
const tileCount = canvas.width / gridSize;

// Inicializar la serpiente (empieza con 3 segmentos)
let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];

// Comida
let food = { x: 5, y: 5 };

// Velocidad / Dirección inicial (moviéndose a la derecha)
let dx = 1;
let dy = 0;

let score = 0;
let gameSpeed = 150; // Milisegundos entre actualizaciones (más bajo = más rápido)
let juegoPausado = true;//El juego empieza congelado

// El bucle principal del juego
function main() {
    if (hasGameEnded()) {
        alert(`Juego Terminado. Tu puntuación fue: ${score}`);
        resetGame();
        return;
    }

    // 1. Esto limpia el tablero y dibuja la manzana y la serpiente quieta al principio
    clearCanvas();
    drawFood();
    drawSnake();

    // 2. Si el juego arranca pausado, se queda repitiendo este bucle quieto
    if (juegoPausado) {
        setTimeout(main, gameSpeed);
        return; 
    }

    // 3. Cuando le das a PLAY, pasa por aquí y la serpiente empieza a correr
    setTimeout(function onTick() {
        moveSnake();
        main(); // Mantiene vivo el bucle del juego
    }, gameSpeed);
}

// Iniciar el juego
generateFood();
main();

// --- CONTROLES PARA ORDENADOR (TECLADO) ---
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const keyPressed = event.keyCode;
    
    // Códigos de las flechas del teclado
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    if (keyPressed === LEFT_KEY && dx !== 1) { dx = -1; dy = 0; }
    if (keyPressed === UP_KEY && dy !== 1) { dx = 0; dy = -1; }
    if (keyPressed === RIGHT_KEY && dx !== -1) { dx = 1; dy = 0; }
    if (keyPressed === DOWN_KEY && dy !== -1) { dx = 0; dy = 1; }
}

// --- CONTROLES PARA MÓVIL (BOTONES TÁCTILES) ---
document.getElementById("btnUp").addEventListener("click", () => {
    if (dy !== 1) { dx = 0; dy = -1; }
});

document.getElementById("btnDown").addEventListener("click", () => {
    if (dy !== -1) { dx = 0; dy = 1; }
});

document.getElementById("btnLeft").addEventListener("click", () => {
    if (dx !== 1) { dx = -1; dy = 0; }
});

document.getElementById("btnRight").addEventListener("click", () => {
    if (dx !== -1) { dx = 1; dy = 0; }
});

// Evitar que la pantalla rebote o se mueva al jugar en el móvil
document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// --- LÓGICA GENERAL DEL JUEGO ---

function clearCanvas() {
    ctx.fillStyle = "#252526";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Dibujar la serpiente verde "código"
function drawSnake() {
    ctx.fillStyle = "#4ec9b0"; 
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function moveSnake() {
    // Crear la nueva cabeza basada en la dirección
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); // Añadir la cabeza al principio

    // Verificar si comió la comida
    const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
    if (hasEatenFood) {
        score += 10;
        scoreElement.innerText = score;
        generateFood();
    } else {
        snake.pop(); // Quitar la cola si no ha comido
    }
}

function drawFood() {
    ctx.fillStyle = "#f44747"; // Rojo manzana
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    
    // Asegurarse de que la comida no aparezca encima de la propia serpiente
    snake.forEach(part => {
        const hasEaten = part.x === food.x && part.y === food.y;
        if (hasEaten) generateFood();
    });
}

function hasGameEnded() {
    // Choque con las paredes
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= tileCount;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= tileCount;

    if (hitLeftWall || hitRightWall || hitToptWall || hitBottomWall) return true;

    // Choque consigo misma
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dx = 1; dy = 0;
    score = 0;
    scoreElement.innerText = score;
    generateFood();
    main();
}
function alternarPausa() {
    juegoPausado = !juegoPausado; // Cambia de true a false, o de false a true
    
    const boton = document.getElementById("btnPausa");
    if (juegoPausado) {
        boton.innerText = "PLAY";
    } else {
        boton.innerText = "PAUSA";
    }
}