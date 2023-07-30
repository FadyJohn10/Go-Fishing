var canvas, ctx, width, height, stems, bubbles;
stems = [];
bubbles = [];
fishGr = [];

function Bubble(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.vy = -Math.random() * 5;
  this.opacity = 0.2 + Math.random() * 0.5;
  this.oldY = y;
  this.oldX = x;
}

Bubble.prototype.draw = function() {
  var strokeColor, fillColor;

  strokeColor = 'rgba(255, 255, 255,' + this.opacity  + ')';
  fillColor = 'rgba(255, 255, 255,' + (this.opacity / 2) + ')';

  ctx.save();
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function Stem(points, color) {
  this.points = points;
  this.color = color;
}

Stem.prototype.draw = function(ctx) {
  var len, ctrlPoint, point;

  len = this.points.length - 1;
  ctrlPoint = {x: 0, y: 0};
  
  ctx.save();
  ctx.strokeStyle = this.color;
  ctx.beginPath();
  ctx.moveTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
  for (var i = len; i >= 1; i--) {
    point = this.points[i];
    ctrlPoint.x = (point.x + this.points[i - 1].x) / 2;
    ctrlPoint.y = (point.y + this.points[i - 1].y) / 2;
    ctx.quadraticCurveTo(point.x, point.y, ctrlPoint.x, ctrlPoint.y);
    ctx.lineWidth = i * 1.1;
    ctx.stroke();
    ctx.fillStyle = 'red';
  }
  ctx.restore();
}

init();
function init(){
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  width = canvas.width = window.innerWidth;
  height = canvas.height = 380;

  populateStems(height / 3, width, 25);
  generateBubbles(10);

  drawFrame();
};

function generateBubbles(bubblesLimit) {
  for (var i = 0; i <= bubblesLimit; i++) {
    bubbles.push(new Bubble(Math.random() * width, height + Math.random() * height / 2, 2 + Math.random() * 2));
  }
}

function populateStems(offset, limit, step) {
  for (var x = 0; x <= limit; x += step) {
    generateStem(x, height / 4 - offset / 2 + Math.random() * offset, 50)
  }
}

function generateStem(x, pointsLen, step) {
  var positions, y, offset, colorsArr, color;

  colorsArr = ['#6e881b', '#5d7314', '#54690f', '#657f0f', '#6f8f06'];
  color = Math.floor(1 + Math.random() * colorsArr.length - 1);
  positions = [];
	
  if (height < 600) {
  	offset = -40 + Math.random() * 80;
    for (y = height - pointsLen; y <= height + 100; y += step / 2) {
      positions.push({x: x + offset / (y / 2000), y: y, angle: Math.random() * 360, speed: 0.1 + Math.random() * 0.3});
    }
  } else {
  	offset = -100 + Math.random() * 200;
    for (y = height - pointsLen; y <= height + 100; y += step) {
      positions.push({x: x + offset / (y / 2000), y: y, angle: Math.random() * 360, speed: 0.1 + Math.random() * 0.3});
    }
  }
  stems.push(new Stem(positions, colorsArr[color]));
}

function drawFrame() {
  window.requestAnimationFrame(drawFrame, canvas);
  ctx.fillStyle = '#6bb8f7';
  ctx.fillRect(0, 0, width, height);
  bubbles.forEach(moveBubble);
  stems.forEach(function(stem) {
    stem.points.forEach(movePoint);
    stem.draw(ctx);
  });
}

function moveBubble(bubble) {
  if (bubble.y + bubble.radius <= 0) bubble.y = bubble.oldY;
  bubble.y += bubble.vy;
  bubble.draw(ctx);
}

function movePoint(point, index) {
  point.x += Math.sin(point.angle) / (index / 2.2);
  point.angle += point.speed;
}

function retHook(){
  document.querySelector(".rod").style.height = "10px";
  document.querySelector(".hook").style.top = "10px";
}

// move boat
document.onkeydown = detectKey;
var boat = document.getElementById('myId');
var rod = document.querySelector(".rod");
var rodStand = document.querySelector(".rod-stand");
var hook = document.querySelector(".hook");
function detectKey(e) {

    var posLeft = boat.offsetLeft;
    var posRight = window.width - boat.offsetLeft - boat.width;

    e = e || window.event;

    if (e.keyCode == '37' && posLeft >= 58) {
        boat.style.marginLeft  = (posLeft-58)+"px";
        rod.style.marginLeft  = (posLeft-58)+"px";
        rodStand.style.marginLeft  = (posLeft-58)+"px";
    }
    else if (e.keyCode == '39' && posRight >= 58) {
        boat.style.marginLeft  = (posLeft+58)+"px";
        rod.style.marginLeft  = (posLeft+58)+"px";
        rodStand.style.marginLeft  = (posLeft+58)+"px";
    }
    else if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
        moveHook();
  }
}

// Function to generate random number within a range
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to animate fish movement
function animateFish(fish) {
  const oceanWidth = window.innerWidth;

  // Generate random speed and direction for the fish
  let speed = getRandomNumber(1, 3);
  let direction = Math.random() < 0.5 ? 1 : -1; // 1 for moving right, -1 for moving left
  let positionX;
  if(direction == 1){
    fish.classList.add("flip-horizontally");
    positionX = -fish.clientWidth;
  }else{
    positionX = oceanWidth;
  }  

  function moveFish() {
    positionX += speed * direction;
    fish.style.left = `${positionX}px`;

    // If the fish goes beyond the ocean container, reset its position and randomize speed and direction
    if (positionX > oceanWidth) {
      positionX = -fish.clientWidth;
    } else if (positionX < -fish.clientWidth) {
      positionX = oceanWidth;
    }

    requestAnimationFrame(moveFish);
  }
  moveFish();
}

function makeFish(){
  const fish = document.createElement("img");
  let fishNo = Math.ceil(getRandomNumber(0, 3));
  fish.src = `./images/fish${fishNo}.png`;
  fish.classList.add("fish");
  let width = getRandomNumber(55, 90);
  fish.style.width = `${width}px`;
  let posY = getRandomNumber(10, 300);
  fish.style.bottom = `${posY}px`;
  document.querySelector(".fishCont").appendChild(fish);
  fishGr.push(fish);
}

function populateFish(){
  for(i = 0; i<4; i++){
    makeFish();
  }
}

function resetFish(){
  for(i=0; i<4; i++){
    fishGr.pop();
  }
}


for(i = 0; i<3; i++){
  populateFish();
  fishGr.forEach(animateFish);
}

function checkCollision(elem1, elem2) {
  const rect1 = elem1.getBoundingClientRect();
  const rect2 = elem2.getBoundingClientRect();

  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

function catchFish() {
  const hookElement = document.querySelector(".hook");

  fishGr.forEach((fish) => {
    if (checkCollision(fish, hookElement)) {
      // Fish is caught!
      fish.remove();
      fishGr.pop();
      console.log("You caught a fish!");
    }else{
      console.log("try again");
    }
  });
}

function moveHook() {
  let clicked = false;
  if(!clicked){
    document.querySelector(".rod").style.height = "500px";
    document.querySelector(".hook").style.top = "480px";
  }
  
  // Code to move the hook element (you can implement your own logic for hook movement here)
    
  // After moving the hook, call the catchFish function to check for collisions
  catchFish();
  // Use requestAnimationFrame to keep the hook moving and checking for collisions continuously
  if (document.querySelector(".rod").clientHeight < 500){
    requestAnimationFrame(moveHook);
  }
  setTimeout(retHook, 600);
  
}