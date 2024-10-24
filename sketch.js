const cols = 300;
const rows = 400;
const margin = [300, 400];
const grid = [];
let noiseImg;

function setup() {
  createCanvas(3508, 4961);

  // Create images to visualize the noise
  noiseImg = createImage(cols, rows);
  noiseImg.loadPixels();

  // Where do we start and end drawing in terms of (x,y) pixels?
  const xStart = margin[0];
  const yStart = margin[1];

  // How many pixels do we move for each point in the grid
  let xStep = (width - 2 * margin[0]) / (cols - 1);
  let yStep = (height - 2 * margin[1]) / (rows - 1);

  createGridPoints(xStart, yStart, xStep, yStep);

  noLoop(); // Prevents continuous drawing
}

function draw() {
  background(255);
  stroke(0);
  noFill();

  // Increase the stroke weight
  strokeWeight(8);

  // Draw the noise image
  image(noiseImg, margin[0], margin[1], width - 2 * margin[0], height - 2 * margin[1]);
}

function createGridPoints(xStart, yStart, xStep, yStep) {
  // For each column
  for (let i = 0; i < cols; i++) {
    let col = [];

    // Create an array with the points that make up this column
    for (let j = 0; j < rows; j++) {
      // The original position of this point
      let x = xStart + i * xStep;
      let y = yStart + j * yStep;

      // How much do we want to shift this point?
      let move = getNoiseVal(x, y, i, j);

      // We scale this noise value so that it's more visible
      move *= 15;

      // Save noise value to the noise image
      let noiseVal = map(move, -10, 10, 0, 255);
      noiseImg.set(i, j, color(noiseVal));
    }

    grid.push(col);
  }
  noiseImg.updatePixels();
}

function getNoiseVal(x, y, i, j) {
  const noiseZoom = 0.0002;

  let noiseVal = noise((x + 0) * noiseZoom, (y + 0) * noiseZoom);

  noiseVal = transformNoise(noiseVal);
  
  return noiseVal; // Return the original noise value
}

// We use a sin wave to transform the noise values into something that oscillates a bit more
// If frequency = 10, then the sine wave goes from -1 to 1 from input values 0 to 0.1
// The sine wave then decreases from 1 to -1 and the input value goes from 0.1 to 0.2 and so on
function transformNoise(x) {
  const frequency = 5;

  x *= frequency;
  x *= 2 * PI;

  let y = sin(x);

  y = map(y, 0, 1, -1, 1);

  if (y < 0) y = -y;

  y = map(y, 0, 1, -1, 1);

  return y;
}

// Save PNG, SVG, and noise image when 's' is pressed
function keyPressed() {
  if (key === 's') {
    // Save as PNG
    saveCanvas('output', 'png');

    // Save the transformed noise image
    noiseImg.save('noise', 'png');
  }
}
