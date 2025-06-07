let letters = [];
let gravity = 0.8;
let bounce = 0.5;
let friction = 0.98;
let letterSize = 100;


function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(letterSize);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0);

  for (let i = 0; i < letters.length; i++) {
    let l1 = letters[i];
    l1.update();

    for (let j = i + 1; j < letters.length; j++) {
      let l2 = letters[j];
      resolveCollision(l1, l2);
    }

    l1.display(i); // Pass the index to the display method
  }
}

function mousePressed() {
  // Не создавать новую букву, если она наложится на существующую
  let newX = mouseX;
  let newY = mouseY;
  let safe = true;
  let newRadius = letterSize / 2;

  for (let l of letters) {
    let d = dist(newX, newY, l.x, l.y);
    if (d < newRadius + l.radius) {
      safe = false;
      break;
    }
  }

  if (safe) {
    letters.push(new FallingLetter(newX, newY, 'A', letters.length));
  }
}

class FallingLetter {
  constructor(x, y, char, index) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.vx = random(-1, 1);
    this.vy = 0;
    this.size = letterSize;
    this.radius = this.size / 2;
    this.index = index; // Store the index of the letter
  }

  update() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    // Столкновение с полом
    if (this.y + this.radius > height) {
      this.y = height - this.radius;
      this.vy *= -bounce;
      this.vx *= friction;
    }

    // Столкновение со стенами
    if (this.x - this.radius < 0 || this.x + this.radius > width) {
      this.vx *= -bounce;
      this.x = constrain(this.x, this.radius, width - this.radius);
    }
  }

  display(index) {
    push();
    stroke(255); // White outline for all letters
    // Every 11th letter (index 0, 11, 22, etc.) gets a thicker white outline
    if (this.index % 11 === 0) {
      strokeWeight(4); 
      stroke('rgb(255,235,0)')// Thicker outline for every 11th letter
    } else {
      strokeWeight(4); // Regular outline for others
    }
    fill(0); // Black fill for the letter
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

    // Отскок
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