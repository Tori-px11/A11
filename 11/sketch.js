let fallingMode = false; // переключатель режимов
let gravity = 0.8;      // гравитация (ускорение вниз)
let friction = 0.95;    // трение по горизонтали, чтобы скорость постепенно уменьшалась

let dots = [];
let numCols = 80; 
let numRows = 80;
let cellSize = 5;
let animationSpeed = 0.05;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('black');
  initializeDots();
}

function initializeDots() {
  dots = [];
  
  let offsetX = (width - numCols * cellSize) / 2;
  let offsetY = (height - numRows * cellSize) / 2;
  
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      let x = offsetX + col * cellSize;
      let y = offsetY + row * cellSize;
      
      let isInShape = isPointInShape(col / numCols, row / numRows);
      
      dots.push({
        x: x,
        y: y,
        originalY: y,
        originalX: x,
        vx: 0,          // скорость по X (для рассыпания)
        vy: 0,          // скорость по Y (для падения)
        inShape: isInShape,
        angle: 0,
        speed: random(0.03, 0.06),
        phaseOffset: random(TWO_PI),
        amplitude: isInShape ? random(5, 15) : 0
      });
    }
  }
}

function isPointInShape(normalizedX, normalizedY) {
  let leftOne = (normalizedX > 0.3 && normalizedX < 0.4 && normalizedY > 0.2 && normalizedY < 0.8);
  let rightOne = (normalizedX > 0.6 && normalizedX < 0.7 && normalizedY > 0.2 && normalizedY < 0.8);
  let leftSerif = (normalizedX > 0.25 && normalizedX < 0.4 && normalizedY > 0.2 && normalizedY < 0.3);
  let rightSerif = (normalizedX > 0.55 && normalizedX < 0.7 && normalizedY > 0.2 && normalizedY < 0.3);
  let leftBase = (normalizedX > 0.25 && normalizedX < 0.45 && normalizedY > 0.75 && normalizedY < 0.85);
  let rightBase = (normalizedX > 0.55 && normalizedX < 0.75 && normalizedY > 0.75 && normalizedY < 0.85);
  return leftOne || rightOne || leftSerif || rightSerif || leftBase || rightBase;
}

function mousePressed() {
  fallingMode = !fallingMode;

  if (fallingMode) {
    // При включении режима падения задаём случайные скорости по X для рассыпания
    for (let dot of dots) {
      if (dot.inShape) {
        dot.vx = random(-3, 3);
        dot.vy = 0; // начальная скорость по Y = 0, гравитация добавит ускорение
      }
    }
  } else {
    // При отключении режима не сбрасываем позиции, только готовим к плавному возврату
    // Velocities will be damped in draw()
  }
}

function draw() {
  background('black');
  let time = frameCount * animationSpeed;
  let repelRadius = 60;
  let repelStrength = 1.5;

  for (let i = 0; i < dots.length; i++) {
    let dot = dots[i];

    if (dot.inShape) {
      if (fallingMode) {
        // Падение с гравитацией и рассыпанием
        dot.vy += gravity;
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Трение по горизонтали
        dot.vx *= friction;

        // Отскок или ограничение по нижней границе
        if (dot.y > height - 2) {
          dot.y = height - 2;
          dot.vy = 0;

          // Можно слегка рандомизировать vx, чтобы точки не остановились в одной линии
          dot.vx += random(-0.5, 0.5);
        }
      } else {
        // Возврат к исходным позициям с плавностью
        let easing = 0.1;
        dot.x += (dot.originalX - dot.x) * easing;
        dot.y += (dot.originalY - dot.y) * easing;

        // Gradually dampen velocities for smooth return
        dot.vx *= 0.9;
        dot.vy *= 0.9;
      }

      // Анимация волны
      dot.angle = time + dot.phaseOffset;
      let waveX = sin(dot.angle) * dot.amplitude;
      let waveY = cos(dot.angle) * dot.amplitude;

      // Текущее положение с волной
      let posX = dot.x + waveX;
      let posY = dot.y + waveY;

      // Отталкивание от мыши (только когда не падают)
      let dx = posX - mouseX;
      let dy = posY - mouseY;
      let distToMouse = sqrt(dx * dx + dy * dy);

      let offsetX = 0;
      let offsetY = 0;

      if (!fallingMode && distToMouse < repelRadius) {
        let force = (repelRadius - distToMouse) / repelRadius;
        offsetX = dx * force * repelStrength;
        offsetY = dy * force * repelStrength;
      }

      // Рисуем точку
      fill('white');
      noStroke();
      ellipse(posX + offsetX, posY + offsetY, 4, 4);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeDots();
}