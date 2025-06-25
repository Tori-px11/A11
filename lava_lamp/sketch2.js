let blobs = [];
let svg;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent(document.body);

  colorMode(HSL);

  svg = SVG().addTo('#lava-wrapper').size(windowWidth, windowHeight);

  let group = makeFilter();
  group.fill('#ffc300'); // 💛 заменённый цвет

  for (let i = 0; i < 30; i++) {
    blobs.push(new Lava(group));
  }
}

function draw() {
  for (let blob of blobs) blob.update();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  svg.size(windowWidth, windowHeight);
}

function makeFilter() {
  let filter = svg.defs().element('filter').id('goo');

  filter.add(svg.element('feGaussianBlur').attr({
    in: "SourceGraphic",
    stdDeviation: 10,
    result: "blur",
  }));

  filter.add(svg.element('feColorMatrix').attr({
    in: "blur",
    type: "matrix",
    values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9",
    result: "goo",
  }));

  filter.add(svg.element('feComposite').attr({
    in: "SourceGraphic",
    in2: "goo",
    operator: "atop",
  }));

  return svg.group().attr('filter', 'url(#goo)');
}

class Lava {
  constructor(group) {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.size = random(50, 200);
    this.sizeTime = random(1000);

    this.el = svg
      .ellipse(this.size, this.size)
      .center(this.pos.x, this.pos.y);

    group.add(this.el);
  }

  update() {
    let a = this.sizeTime, as = 0.2;
    let sizeX = (1 + sin(a) * as) * this.size;
    let sizeY = (1 + sin(a + PI) * as) * this.size;

    let acc = createVector(0, map(this.pos.y, 0, height, 1, -1) * 0.1 / this.size);
    this.vel.add(acc);
    this.vel.limit(0.5);
    this.pos.add(this.vel);

    this.sizeTime += abs(this.vel.mag()) * 0.05 + 0.005;

    this.el
      .size(sizeX, sizeY)
      .center(this.pos.x, this.pos.y);
  }
}
