let dots = [];
let grid = [];
let gridSize = 12;
let dotSize = 6;
let spacing = 12;
let time = 0;
let waveSpeed = 0.05;
let waveAmplitude = 0.5;

let exploded = false;
let explosionVectors = [];
let explosionSpeed = 5;
let returnSpeed = 0.1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {
      grid.push({ x, y });
    }
  }

  createLetterA();
}

function createLetterA() {
  let centerX = width / 2;
  let centerY = height / 2;
  let letterWidth = 200;
  let letterHeight = 280;
  let startX = centerX - letterWidth / 2;
  let startY = centerY - letterHeight / 2;

  dots = [];
  explosionVectors = [];

  for (let i = 0; i < grid.length; i++) {
    let x = grid[i].x;
    let y = grid[i].y;
    let relX = x - startX;
    let relY = y - startY;

    if (isPartOfLetterA(relX, relY, letterWidth, letterHeight)) {
      dots.push({
        gridX: x,
        gridY: y,
        x: x,        // текущая позиция X
        y: y,        // текущая позиция Y
        size: dotSize,
        offset: random(TWO_PI),
        active: true
      });
      let angle = random(TWO_PI);
      explosionVectors.push({
        x: cos(angle),
        y: sin(angle)
      });
    }
  }
}

function isPartOfLetterA(x, y, width, height) {
  let nx = x / width;
  let ny = y / height;

  let leftDiagonal = (nx > 0.15 && nx < 0.57) && (ny > (1 - nx * 2) && ny < (1.2 - nx * 2));
  let rightDiagonal = (nx > 0.57 && nx < 0.85) && (ny > (nx * 1.9 - 1.2) && ny < (nx * 2 - 0.79));
  let horizontalBar = (nx > 0.25 && nx < 0.75) && (ny > 0.45 && ny < 0.55);

  return leftDiagonal || rightDiagonal || horizontalBar;
}

function draw() {
  background(0);
  fill(255);
  noStroke();

  time += 0.03;

  for (let i = 0; i < dots.length; i++) {
    let dot = dots[i];

    if (exploded) {
      // Разлет точек
      dot.x += explosionVectors[i].x * explosionSpeed;
      dot.y += explosionVectors[i].y * explosionSpeed;
    } else {
      // Плавное возвращение к grid позиции
      dot.x = lerp(dot.x, dot.gridX, returnSpeed);
      dot.y = lerp(dot.y, dot.gridY, returnSpeed);
    }

    // Волна и отталкивание мышью применяются только к отображению, без изменения dot.x/y напрямую
    let waveOffset = sin(time + dot.offset) * waveAmplitude * spacing;
    let baseX = dot.x + cos(time * waveSpeed + dot.offset) * waveOffset;
    let baseY = dot.y + sin(time * waveSpeed + dot.offset * 0.5) * waveOffset;

    // Отталкивание от курсора
    let dx = baseX - mouseX;
    let dy = baseY - mouseY;
    let distToMouse = sqrt(dx * dx + dy * dy);
    let repelRadius = 80;
    let repelStrength = 1.2;

    let offsetX = 0;
    let offsetY = 0;

    if (distToMouse < repelRadius) {
      let force = (repelRadius - distToMouse) / repelRadius;
      offsetX = dx * force * repelStrength;
      offsetY = dy * force * repelStrength;
    }

    circle(
      baseX + offsetX,
      baseY + offsetY,
      dot.size + sin(time + dot.offset) * 2
    );
  }
}

function mousePressed() {
  exploded = !exploded;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  grid = [];
  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {
      grid.push({ x, y });
    }
  }
  createLetterA();
}
