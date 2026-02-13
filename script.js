// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const startButton = document.getElementById('startButton');

// Game state
let score = 0;
let lives = 3;
let gameRunning = false;

// Pacman properties
const pacman = {
    x: 224,
    y: 400,
    radius: 10,
    speed: 5,
    direction: 'right',
    nextDirection: 'right'
};

// Ghost properties
const ghosts = [
    { x: 224, y: 200, radius: 10, color: '#FF0000', speed: 3 }, // Blinky
    { x: 200, y: 200, radius: 10, color: '#FFB8FF', speed: 3 }, // Pinky
    { x: 248, y: 200, radius: 10, color: '#00FFFF', speed: 3 }, // Inky
    { x: 224, y: 240, radius: 10, color: '#FFB852', speed: 3 }  // Clyde
];

// Maze layout (1 = wall, 0 = dot, 2 = empty space)
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [2, 2, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 2],
    [1, 1, 1, 1, 0, 1, 2, 1, 1, 2, 1, 1, 2, 1, 0, 0, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 0, 2, 2, 1, 0, 0, 0, 1, 2, 2, 0, 0, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 0, 0, 1, 1, 1, 1, 1],
    [2, 2, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 2],
    [1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Draw maze
function drawMaze() {
    const cellWidth = canvas.width / maze[0].length;
    const cellHeight = canvas.height / maze.length;
    
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const x = col * cellWidth;
            const y = row * cellHeight;
            
            if (maze[row][col] === 1) {
                // Wall
                ctx.fillStyle = '#2222FF';
                ctx.fillRect(x, y, cellWidth, cellHeight);
                
                // Wall border
                ctx.strokeStyle = '#0000AA';
                ctx.strokeRect(x, y, cellWidth, cellHeight);
            } else if (maze[row][col] === 0) {
                // Dot
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(x + cellWidth/2, y + cellHeight/2, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// Draw Pacman
function drawPacman() {
    ctx.save();
    ctx.translate(pacman.x, pacman.y);
    
    // Draw Pacman as a circle with a mouth
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    
    let startAngle, endAngle;
    switch(pacman.direction) {
        case 'right':
            startAngle = 0.2 * Math.PI;
            endAngle = 1.8 * Math.PI;
            break;
        case 'left':
            startAngle = 1.2 * Math.PI;
            endAngle = 0.8 * Math.PI;
            break;
        case 'up':
            startAngle = 1.7 * Math.PI;
            endAngle = 1.3 * Math.PI;
            break;
        case 'down':
            startAngle = 0.7 * Math.PI;
            endAngle = 0.3 * Math.PI;
            break;
        default:
            startAngle = 0.2 * Math.PI;
            endAngle = 1.8 * Math.PI;
    }
    
    ctx.arc(0, 0, pacman.radius, startAngle, endAngle);
    ctx.lineTo(0, 0);
    ctx.fill();
    
    ctx.restore();
}

// Draw ghosts
function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.save();
        ctx.translate(ghost.x, ghost.y);
        
        // Draw ghost body
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(0, 0, ghost.radius, Math.PI, 0, false);
        ctx.lineTo(ghost.radius, ghost.radius);
        ctx.lineTo(-ghost.radius, ghost.radius);
        ctx.closePath();
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-ghost.radius/3, -ghost.radius/3, ghost.radius/3, 0, Math.PI * 2);
        ctx.arc(ghost.radius/3, -ghost.radius/3, ghost.radius/3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(-ghost.radius/3, -ghost.radius/3, ghost.radius/6, 0, Math.PI * 2);
        ctx.arc(ghost.radius/3, -ghost.radius/3, ghost.radius/6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    });
}

// Update Pacman position
function updatePacman() {
    // Try to change direction if requested
    if (canMove(pacman.nextDirection)) {
        pacman.direction = pacman.nextDirection;
    }
    
    // Move in current direction
    if (canMove(pacman.direction)) {
        switch(pacman.direction) {
            case 'right':
                pacman.x += pacman.speed;
                break;
            case 'left':
                pacman.x -= pacman.speed;
                break;
            case 'up':
                pacman.y -= pacman.speed;
                break;
            case 'down':
                pacman.y += pacman.speed;
                break;
        }
    }
    
    // Boundary checks
    if (pacman.x < pacman.radius) {
        pacman.x = canvas.width - pacman.radius;
    } else if (pacman.x > canvas.width - pacman.radius) {
        pacman.x = pacman.radius;
    }
}

// Check if movement in a direction is possible
function canMove(direction) {
    let testX = pacman.x;
    let testY = pacman.y;
    
    switch(direction) {
        case 'right':
            testX += pacman.speed;
            break;
        case 'left':
            testX -= pacman.speed;
            break;
        case 'up':
            testY -= pacman.speed;
            break;
        case 'down':
            testY += pacman.speed;
            break;
    }
    
    // Check boundaries
    if (testX < pacman.radius || testX > canvas.width - pacman.radius ||
        testY < pacman.radius || testY > canvas.height - pacman.radius) {
        return false;
    }
    
    // Check maze collisions (simple version)
    const cellWidth = canvas.width / maze[0].length;
    const cellHeight = canvas.height / maze.length;
    
    const gridX = Math.floor(testX / cellWidth);
    const gridY = Math.floor(testY / cellHeight);
    
    if (gridX >= 0 && gridX < maze[0].length && gridY >= 0 && gridY < maze.length) {
        return maze[gridY][gridX] !== 1;
    }
    
    return false;
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawMaze();
    drawPacman();
    drawGhosts();
    
    // Update game state
    updatePacman();
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    gameRunning = true;
    startButton.textContent = "Pause Game";
    gameLoop();
}

// Pause game
function pauseGame() {
    gameRunning = false;
    startButton.textContent = "Resume Game";
}

// Event listeners
startButton.addEventListener('click', () => {
    if (gameRunning) {
        pauseGame();
    } else {
        startGame();
    }
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            pacman.nextDirection = 'up';
            break;
        case 'ArrowDown':
            pacman.nextDirection = 'down';
            break;
        case 'ArrowLeft':
            pacman.nextDirection = 'left';
            break;
        case 'ArrowRight':
            pacman.nextDirection = 'right';
            break;
    }
});

// Initialize the game
drawMaze();
drawPacman();
drawGhosts();
