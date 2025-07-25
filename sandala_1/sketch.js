let canvasSize;
let strokes = []; // Array to store strokes (each stroke is an array of points)
let currentStroke = null; // Current stroke being drawn
let clearButton; // Button for clearing canvas
let replayButton; // Button for replaying strokes

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('black');
  angleMode(DEGREES); // Use degrees for rotation
  
  // Create clear button (top-right, rounded rectangle)
  clearButton = createButton('Clear');
  clearButton.position(windowWidth - 100, 20); // Top-right corner
  clearButton.style('background-color', '#ffffff'); // White background
  clearButton.style('color', '#333'); // Dark text
  clearButton.style('border', '1px solid yellow'); // Yellow border
  clearButton.style('border-radius', '30px'); // Rounded edges
  clearButton.style('padding', '10px 20px'); // Padding for size
  clearButton.style('font-size', '16px'); // Readable font size
  clearButton.style('cursor', 'pointer'); // Pointer cursor
  clearButton.mousePressed(clearCanvas); // Attach clear function
}

function clearCanvas() {
  strokes = []; // Clear all strokes
}

function replayStrokes() {
  // Placeholder for replay functionality
  console.log('Replay button pressed');
}

function draw() {
  background('black'); // Clear canvas with black background
  translate(width / 2, height / 2); // Move origin to center
  
  // Draw all strokes with 8-fold symmetry
  stroke(255, 255, 0, 100); // Brighter semi-transparent yellow
  strokeWeight(3); // Slightly thicker for ribbon-like effect
  noFill();
  for (let stroke of strokes) {
    for (let i = 0; i < 8; i++) {
      push();
      rotate(i * 45); // Apply 8-fold symmetry
      beginShape();
      for (let point of stroke) {
        vertex(point.x, point.y);
      }
      endShape();
      pop();
    }
  }
  
  // Draw current stroke (if being drawn)
  if (currentStroke) {
    for (let i = 0; i < 8; i++) {
      push();
      rotate(i * 45);
      beginShape();
      for (let point of currentStroke) {
        vertex(point.x, point.y);
      }
      endShape();
      pop();
    }
  }
}

function mousePressed() {
  // Start a new stroke
  currentStroke = [];
  let x = mouseX - width / 2;
  let y = mouseY - height / 2;
  currentStroke.push({ x, y });
}

function mouseDragged() {
  // Add points to current stroke, but limit frequency for smoothness
  let x = mouseX - width / 2;
  let y = mouseY - height / 2;
  let lastPoint = currentStroke[currentStroke.length - 1];
  
  // Only add point if moved a minimum distance (reduces jaggedness)
  if (!lastPoint || dist(x, y, lastPoint.x, lastPoint.y) > 2) {
    currentStroke.push({ x, y });
  }
}

function mouseReleased() {
  // Save current stroke and reset
  if (currentStroke && currentStroke.length > 1) {
    strokes.push(currentStroke);
  }
  currentStroke = null;
}

function keyPressed() {
  // Clear canvas (like Silk's Space key)
  if (key === ' ') {
    strokes = [];
  }
  // Undo last stroke (like Silk's Z key)
  if (key === 'z' || key === 'Z') {
    strokes.pop();
  }
}

function windowResized() {
  canvasSize = min(windowWidth, windowHeight);
  resizeCanvas(canvasSize, canvasSize);
  strokes = []; // Clear strokes on resize to avoid coordinate issues
  // Reposition buttons after resize
  clearButton.position(windowWidth - 100, 10);
  replayButton.position(10, windowHeight / 2 - 25);
}