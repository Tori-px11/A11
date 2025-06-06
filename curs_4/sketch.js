let confettiParticles = [];
let displayMode = 0;
let confettiSize = 24;
let plusBtn, minusBtn, backBtn;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(confettiSize);

  // Кнопка "+"
  plusBtn = createButton('+');
  plusBtn.position(windowWidth - 80, 20);
  styleButton(plusBtn);
  plusBtn.mousePressed(() => {
    confettiSize = min(confettiSize + 6, 80);
    textSize(confettiSize);
  });

  // Кнопка "−"
  minusBtn = createButton('–');
  minusBtn.position(windowWidth - 130, 20);
  styleButton(minusBtn);
  minusBtn.mousePressed(() => {
    confettiSize = max(confettiSize - 6, 8);
    textSize(confettiSize);
  });

  // Кнопка "←" Назад
  backBtn = createButton('←');
  backBtn.position(20, 20);
  styleButton(backBtn);
  backBtn.mousePressed(() => {
    window.history.back(); // Возвращаемся назад в браузере
  });
}

function styleButton(btn) {
  btn.style('background-color', '#ffc300');
  btn.style('color', 'black');
  btn.style('border', 'none');
  btn.style('border-radius', '9999px');
  btn.style('padding', '10px 16px');
  btn.style('font-size', '20px');
  btn.style('font-weight', 'bold');
  btn.style('cursor', 'pointer');
}

function draw() {
  background(0);
  confettiParticles.push(new Confetti(mouseX, mouseY, displayMode));

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    let p = confettiParticles[i];
    p.update();
    p.show();
    if (p.isDead()) {
      confettiParticles.splice(i, 1);
    }
  }
}

function mousePressed() {
  displayMode = (displayMode + 1) % 4;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  plusBtn.position(windowWidth - 80, 20);
  minusBtn.position(windowWidth - 130, 20);
  backBtn.position(20, 20);
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.ax = 0;
    this.ay = 0;
    this.lifetime = 255;
    this.r = confettiSize / 2;
  }

  update() {
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;
    this.lifetime -= 4;
  }

  isDead() {
    return this.lifetime < 0;
  }
}

class Confetti extends Particle {
  constructor(x, y, mode) {
    super(x, y);
    this.mode = mode;
  }

  show() {
    noStroke();
    textSize(confettiSize);

    if (this.mode === 3) {
      fill(255, 204, 0, this.lifetime);
      text("☀", this.x, this.y);
    } else {
      fill(255, this.lifetime);
      if (this.mode === 0) {
        ellipse(this.x, this.y, confettiSize);
      } else if (this.mode === 1) {
        text("♥", this.x, this.y);
      } else if (this.mode === 2) {
        text("✿", this.x, this.y);
      }
    }
  }
}
