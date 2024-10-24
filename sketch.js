const canvasSize = [800, 1000];
const blocks = [1, 4];
const sizeX = Math.floor(canvasSize[0] / blocks[0]);
const sizeY = Math.floor(canvasSize[1] / blocks[1]);
const margin = [0,0];
const grid = [];
let noiseImg;

const colour1 = [51, 30, 12];
const colour2 = [170, 108, 57];
const colour3 = colour2;

function setup() {
  createCanvas(canvasSize[0], canvasSize[1]);

  // Create images to visualize the noise
  noiseImg = createImage(sizeX*blocks[0], sizeY*blocks[1]);
  noiseImg.loadPixels();

  // Where do we start and end drawing in terms of (x,y) pixels?
  const xStart = margin[0];
  const yStart = margin[1];

  let n = 0;

  for (let i = 0; i < blocks[0]; i++) {
    for (let j = 0; j < blocks[1]; j++) {
      const startX = i * sizeX;
      const startY = j * sizeY;

      createNoiseBlock(startX, startY, sizeX, sizeY, n);
      n++;
    }
  }

  // Display the image
  image(noiseImg, xStart, yStart, sizeX, sizeY);

  noLoop(); // Prevents continuous drawing
}

function createNoiseBlock(startX, startY, sizeX, sizeY, n) {
  for (let i = 0; i < sizeX; i++) {
    for (let j = 0; j < sizeY; j++) {
      let x = startX + i;
      let y = startY + j;

      // A value between -1 and 1
      let noiseVal = getNoiseVal(i, j, n);

      var c;

      // If n is odd then flip the colour
      if (n % 2 == 0) {
        // Use noiseVal to interpolate between colour1 and colour2
        c = lerpColor(color(colour1), color(colour2), noiseVal);
      }
      else {
        c = lerpColor(color(colour1), color(colour3), noiseVal);
      }

      noiseImg.set(x, y, c);
    }
  }
  noiseImg.updatePixels();
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


function getNoiseVal(x, y, t) {
  const noiseZoom = 0.0008;

  let noiseVal = noise((x + 0) * noiseZoom, (y + 0) * noiseZoom, t*0.06);

  noiseVal = transformNoise(noiseVal);
  
  return noiseVal; // Return the original noise value
}

// We use a sin wave to transform the noise values into something that oscillates a bit more
// If frequency = 10, then the sine wave goes from -1 to 1 from input values 0 to 0.1
// The sine wave then decreases from 1 to -1 and the input value goes from 0.1 to 0.2 and so on
function transformNoise(x) {
  const frequency = 2;

  x *= frequency;
  x *= 2 * PI;

  let y = sin(x);

  // y = map(y, -1, 1, 0, 1);

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
  }
}
