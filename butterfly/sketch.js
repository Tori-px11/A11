let texts = [
  "Hello",
  "Right now, you need to rest",
  "I'd like to ask you to put your phone down",
  "Now you should dive into the music",
  "And so you don’t stare into the void, we have a butterfly you can zone out on"
];

let currentIndex = 0;
let mode = "text";       // "text" → "black"
let switchTime = 0;
let showThankYou = false;

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

    if (showThankYou) {
      textSize(32);
      text("thank you :)", width / 2, height / 2);
    }
  }
}

function mousePressed() {
  if (mode === "text") {
    currentIndex++;
    if (currentIndex >= texts.length) {
      mode = "black";
      switchTime = millis();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
