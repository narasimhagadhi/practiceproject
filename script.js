let score=0;
const scoreDisplay=document.getElementById("score");
const gameOverScreen = document.getElementById("gameOverScreen");
const restartBtn = document.getElementById("restartBtn");

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 }
];
let direction = { x: 1, y: 0 };
let food = { x: 15, y: 15 };
let pokemonImage = new Image();

async function fetchPokemon() {
  const id = Math.floor(Math.random() * 151) + 1;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();
  pokemonImage.src = data.sprites.front_default;
}
fetchPokemon();

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp': if (direction.y === 0) direction = { x: 0, y: -1 }; break;
    case 'ArrowDown': if (direction.y === 0) direction = { x: 0, y: 1 }; break;
    case 'ArrowLeft': if (direction.x === 0) direction = { x: -1, y: 0 }; break;
    case 'ArrowRight': if (direction.x === 0) direction = { x: 1, y: 0 }; break;
  }
});

function gameLoop() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    alert('Game Over! Refresh to play again.');
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
      score +=10;
      scoreDisplay.textContent = score;
    //fetchPokemon();
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } else {
    snake.pop();
  }

  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // DRAW SNAKE
  ctx.fillStyle = 'lime';
  snake.forEach(part => {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  });

  // DRAW POKEMON (FOOD)
  if (pokemonImage.complete && pokemonImage.naturalHeight !== 0) {
    ctx.drawImage(pokemonImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  } else {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  }

  setTimeout(gameLoop, 100);
}

gameLoop();
restartBtn.addEventListener("click", () => {
  // Reset everything
  score = 0;
  scoreDisplay.textContent = score;

  snake = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 }
  ];
  direction = { x: 1, y: 0 };

  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };

  gameOverScreen.style.display = "none";
  gameLoop(); // Start the game again
});

