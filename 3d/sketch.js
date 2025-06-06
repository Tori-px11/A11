function windowResized() {
  console.log("resized");
  let width = document.querySelector("#sketch-div").clientWidth;
  console.log(width);
  let height = document.querySelector("#sketch-div").clientHeight;
  console.log(height);
  resizeCanvas(width, windowHeight);
  
}
function setup() {
  frameRate(10);
  var canvas = createCanvas(windowWidth, windowHeight)
  canvas.parent('sketch-div')
  canvas.position(0, 0)
  canvas.style('z-index', '-1')
  background(30);
  stroke(200);
  noFill();
  strokeWeight(1);
}

function draw() {
  background(30);
  
  for (let x = 20; x < width; x += 40) {
    for (let y = 20; y < height; y += 40) {
      let distance = dist(x, y, mouseX, mouseY);
      let size = map(distance, 0, 200, 15, 0);
      size += 5 * sin(frameCount * 0.05 + distance * 0.05);
      size = constrain(size, 0, 15);
      push();
      translate(x, y);
      rotate(radians((x + y + frameCount) % 360));
      line(-size, 0, size, 0);
      line(0, -size, 0, size);
      pop();
    }
  }
}

