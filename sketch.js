let letters = [];
let gravity = 0.8;
let bounce = 0.5;
let friction = 0.98;
let letterSize;
let clickCount = 0;
let freezeAll = false;
let buttonSize = 50;

let animationStarted = false;  // флаг запуска анимации

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('page1');
  letterSize = min(width, height) * 0.6;
  textSize(letterSize);
  textAlign(CENTER, CENTER);
  textFont('Manrope');
  textStyle(BOLD);

  document.getElementById("page1").style.display = "block";

  // Изначально показываем кнопку click here по центру
  const clickHereBtn = document.getElementById("clickHereBtn");
  clickHereBtn.innerText = "click anywhere on the screen"; // Обновлённый текст
  clickHereBtn.style.display = "block";
  clickHereBtn.style.top = "50%";
  clickHereBtn.style.left = "50%";
  clickHereBtn.style.transform = "translate(-50%, -50%)";
  clickHereBtn.style.backgroundColor = "#000000"; // Цвет изменён на чёрный
  clickHereBtn.style.color = "#ffffff"; // Белый текст для контраста
  clickHereBtn.style.borderRadius = "30px"; // Округлённые края


  // Обработчик клика на кнопку
  clickHereBtn.addEventListener("click", startAnimation);

  // Обработчик клика по всему экрану (кроме кнопки) для запуска анимации
  canvas.mousePressed(() => {
    if (!animationStarted) startAnimation();
  });

  // Кнопка Next
  document.getElementById("nextBtn").addEventListener("click", () => {
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
  });
}

function startAnimation() {
  if (animationStarted) return;
  animationStarted = true;

  // Скрываем кнопку click here
  document.getElementById("clickHereBtn").style.display = "none";

  // Добавляем первую букву в центр экрана
  letters.push(new FallingLetter(width / 2, height / 2, "A"));

  // Показываем кнопку Next внизу справа
  document.getElementById("nextBtn").style.display = "block";
  document.getElementById("nextBtn").style.backgroundColor = "#ffc300"; // Changed to #ffc300
  document.getElementById("nextBtn").style.borderRadius = "30px"; // Increased roundness
}

function draw() {
  if (document.getElementById("page1").style.display !== "block") return;

  background(0);

  if (!freezeAll && animationStarted) {
    for (let i = 0; i < letters.length; i++) {
      let l1 = letters[i];
      l1.update();

      for (let j = i + 1; j < letters.length; j++) {
        let l2 = letters[j];
        resolveCollision(l1, l2);
      }

      l1.display();
    }
  }

  drawResetButton();
}

function mousePressed() {
  if (document.getElementById("page1").style.display !== "block") return;

  if (mouseX > width - buttonSize - 10 && mouseX < width - 10 &&
      mouseY > 10 && mouseY < 10 + buttonSize) {
    resetScene();
    return;
  }

  if (animationStarted) {
    if (clickCount === 0) {
      letters.push(new FallingLetter(mouseX, mouseY, "11"));
      clickCount++;
    } else if (clickCount === 1) {
      freezeAll = true;
      clickCount++;
    }
  }
}

function drawResetButton() {
  push();
  noStroke();
  fill('#ffc300'); // Changed to #ffc300
  rect(width - buttonSize - 10, 10, buttonSize, buttonSize, 15); // Increased corner radius to 15
  fill(0);
  textSize(28);
  text("⟳", width - buttonSize / 2 - 10, buttonSize / 2 + 10);
  pop();
}

function resetScene() {
  letters = [];
  clickCount = 0;
  freezeAll = false;
  animationStarted = false;

  // Показываем кнопку click here заново
  const clickHereBtn = document.getElementById("clickHereBtn");
  clickHereBtn.style.display = "block";
  clickHereBtn.style.top = "50%";
  clickHereBtn.style.left = "50%";
  clickHereBtn.style.transform = "translate(-50%, -50%)";
  clickHereBtn.style.backgroundColor = "#ffc300"; // Changed to #ffc300
  clickHereBtn.style.borderRadius = "30px"; // Increased roundness

  document.getElementById("nextBtn").style.display = "none";
}

class FallingLetter {
  constructor(x, y, char) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.vx = random(-1, 1);
    this.vy = 0;
    this.size = letterSize;
    this.radius = this.size / 2;
  }

  update() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    if (this.y + this.radius > height) {
      this.y = height - this.radius;
      this.vy *= -bounce;
      this.vx *= friction;
    }

    if (this.x - this.radius < 0 || this.x + this.radius > width) {
      this.vx *= -bounce;
      this.x = constrain(this.x, this.radius, width - this.radius);
    }
  }

  display() {
    push();
    stroke('rgb(255,195,0)');
    strokeWeight(10);
    fill(this.char === "A" ? 'rgb(255,195,0)' : 0);
    text(this.char, this.x, this.y);
    pop();
  }
}

function resolveCollision(a, b) {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  let distance = sqrt(dx * dx + dy * dy);
  let minDist = a.radius + b.radius;

  if (distance < minDist && distance > 0) {
    let overlap = minDist - distance;
    let angle = atan2(dy, dx);

    let shiftX = (overlap / 2) * cos(angle);
    let shiftY = (overlap / 2) * sin(angle);

    a.x -= shiftX;
    a.y -= shiftY;
    b.x += shiftX;
    b.y += shiftY;

    let normalX = dx / distance;
    let normalY = dy / distance;

    let relativeVX = b.vx - a.vx;
    let relativeVY = b.vy - a.vy;

    let speed = relativeVX * normalX + relativeVY * normalY;
    if (speed > 0) return;

    let impulse = speed * bounce;
    a.vx += impulse * normalX;
    a.vy += impulse * normalY;
    b.vx -= impulse * normalX;
    b.vy -= impulse * normalY;
  }
}

function selectRelaxation(type) {
  console.log(`Selected relaxation type: ${type}`);
  alert(`You selected: ${type} relaxation`);
}

function selectRelaxation(type) {
  console.log(`Selected relaxation type: ${type}`);
  // Add your relaxation selection logic here
  alert(`You selected: ${type} relaxation`);
}