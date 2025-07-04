let texts = [
  "Hello",
  "Right now, you need to rest",
  "I'd like to ask you to put your phone down",
  "Now you should dive into the music",
  "And so you don’t feel lost, let the soothing sounds guide you to peace"
];

let currentIndex = 0;
let mode = "text";       // "text" → "black"
let switchTime = 0;
let showThankYou = false;
let particles = [];      // Array to hold particles

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(28);
  fill(255);
}

function draw() {
  background(0);

  if (mode === "text") {
    text(texts[currentIndex], width / 2, height / 2);
  } else if (mode === "black") {
    if (!showThankYou && millis() - switchTime > 30000) {
      showThankYou = true;
    }

    // Render particles during the 30-second break
    if (!showThankYou) {
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1); // Remove fully faded particles
        }
      }
      // Add new particles occasionally
      if (random(1) < 0.02) {
        particles.push(new Particle());
      }
    }

    if (showThankYou) {
      textSize(32);
      text("ты молодец", width / 2, height / 2); // Changed to "ты молодец"
    }
  }
}

function mousePressed() {
  if (mode === "text") {
    currentIndex++;
    if (currentIndex >= texts.length) {
      mode = "black";
      switchTime = millis();
      // Initialize particles when switching to black mode
      for (let i = 0; i < 20; i++) {
        particles.push(new Particle());
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Particle class for semi-transparent, floating particles
class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.size = random(10, 30);
    this.alpha = 255;
    this.life = random(100, 200);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 1;
    this.alpha = map(this.life, 0, 200, 0, 255);
    if (this.alpha < 0) this.alpha = 0;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  display() {
    noStroke();
    fill(255, 165, 0, this.alpha); // Semi-transparent orange particles
    ellipse(this.x, this.y, this.size, this.size);
  }
}