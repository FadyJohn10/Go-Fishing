var canvas, ctx, width, height, stems, bubbles, noOfFish, caught = 0, score1 = 0, score2 = 0, highScore = 0;
stems = [];
bubbles = [];
fishGr = [];

let waveSound = new Audio('./ocean.wav');
let rodSound = new Audio('./rod.wav');

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

function initCanvas(){
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  width = canvas.width = window.innerWidth;
  height = canvas.height = 380;

  populateStems(height / 3, width, 25);
  generateBubbles(10);

  drawFrame();
};

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

    // If the fish goes beyond the ocean container
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
  let fishNo = Math.ceil(getRandomNumber(0, 5));
  fish.src = `./images/fish${fishNo}.png`;
  fish.classList.add("fish");
  let width = getRandomNumber(55, 90);
  fish.style.width = `${width}px`;
  let posY = getRandomNumber(10, 300);
  fish.style.bottom = `${posY}px`;
  document.querySelector(".fishCont").appendChild(fish);
  fishGr.push(fish);
}

function populateFish(no){
  for(i = 0; i<no; i++){
    makeFish();
  }
}

function resetFish(no){
  for(i=0; i<no; i++){
    fishGr.pop();
  }
}

function checkCollision(elem1, elem2) {
  const rect1 = elem1.getBoundingClientRect();
  const rect2 = elem2.getBoundingClientRect();

  return!(rect2.left > rect1.right || 
    rect2.right < rect1.left || 
    rect2.top > rect1.bottom || 
    rect2.bottom < rect1.top);
}

function catchFish(id) {
  let hook = document.getElementById(`hook${id}`);
  fishGr.forEach((fish) => {
    if (checkCollision(fish, hook)) {
      if(id == 1){
        score1 += fish.width;
      }else{
        score2 += fish.width;
      }
      fish.style.transition = "all .5s cubic-bezier(0, 0, 0.12, 0.97)";
      fish.style.bottom = "375px";
      setTimeout(() => {
        fish.remove();
      }, 400);
      updateScore(id);
      caught++;
      console.log("caught: ", caught);
    }
  });
}

function moveHook(id) {
  document.getElementById(`rod${id}`).style.height = "500px";
  document.getElementById(`hook${id}`).style.top = "480px";
  catchFish(id);
  if (document.getElementById(`rod${id}`).clientHeight < 500){
    requestAnimationFrame(function(){
      moveHook(id);
    })
  }
  rodSound.play();
  setTimeout(function() {
    returnHook(id);
  }, 600)
}

function returnHook(id){
  document.getElementById(`rod${id}`).style.height = "10px";
  document.getElementById(`hook${id}`).style.top = "10px";
}

document.onkeydown = detectKey;
var boat1 = document.getElementById('boat1');
var fisher1 = document.getElementById("fisher1");
var rod1 = document.getElementById("rod1");
var rodStand1 = document.getElementById("stand1");
var hook1 = document.getElementById("hook1");
var boat2 = document.getElementById('boat2');
var fisher2 = document.getElementById("fisher2");
var rod2 = document.getElementById("rod2");
var rodStand2 = document.getElementById("stand2");
var hook2 = document.getElementById("hook2");
function detectKey(e) {

    var posLeft = boat1.offsetLeft;
    var posRight = window.width - boat1.offsetLeft - boat1.width;
    var posLeft2 = boat2.offsetLeft;
    var posRight2 = window.width - boat2.offsetLeft - boat2.width;

    e = e || window.event;

    if (e.keyCode == '37' && posLeft >= 58) {
        boat1.style.marginLeft  = (posLeft-58)+"px";
        fisher1.style.marginLeft  = (posLeft-58)+"px";
        rod1.style.marginLeft  = (posLeft-58)+"px";
        rodStand1.style.marginLeft  = (posLeft-58)+"px";
    }
    else if (e.keyCode == '39' && posRight >= 58) {
        boat1.style.marginLeft  = (posLeft+58)+"px";
        fisher1.style.marginLeft  = (posLeft+58)+"px";
        rod1.style.marginLeft  = (posLeft+58)+"px";
        rodStand1.style.marginLeft  = (posLeft+58)+"px";
    }
    else if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
        if (document.getElementById("rod1").clientHeight == 10){
          moveHook(1);
        }
    }else if (e.keyCode == '65' && posLeft2 >= 58) {
      console.log("pressed");
      boat2.style.marginRight  = (posRight2+58)+"px";
      fisher2.style.marginRight  = (posRight2+58)+"px";
      rod2.style.marginRight  = (posRight2+58)+"px";
      rodStand2.style.marginRight  = (posRight2+58)+"px";
      }
      else if (e.keyCode == '68' && posRight2 >= 58) {
          boat2.style.marginRight  = (posRight2-58)+"px";
          fisher2.style.marginRight  = (posRight2-58)+"px";
          rod2.style.marginRight  = (posRight2-58)+"px";
          rodStand2.style.marginRight  = (posRight2-58)+"px";
      }
      else if (e.keyCode == '83') {
          if (document.getElementById("rod2").clientHeight == 10){
            moveHook(2);
          }
      }
}

function displayScore(){
  let p = document.createElement("p");
  p.style.position = "absolute";
  p.style.left = "15px";
  p.style.top = "10px";
  p.id = "scorre1";
  p.innerHTML = "Score: ";
  let spanScore = document.createElement("span");
  spanScore.id = "score1";
  spanScore.innerHTML = "0";
  p.appendChild(spanScore);
  document.querySelector(".score-board").appendChild(p);
}

function displayPlayer2Score(){
  let p = document.createElement("p");
  p.style.position = "absolute";
  p.style.right = "15px";
  p.style.top = "10px";
  p.id = "scorre2";
  p.innerHTML = "Score: ";
  let spanScore = document.createElement("span");
  spanScore.id = "score2";
  spanScore.innerHTML = "0";
  p.appendChild(spanScore);
  document.querySelector(".score-board").appendChild(p);
}

function updateScore(id){
  if(id == 1){
    document.getElementById("score1").innerHTML = score1;
  }else{
    document.getElementById("score2").innerHTML = score2;
  }
}
var timer = 45;
function displayTimer(){
  let timerCount = timer;
  let timerReq = setInterval(function () {
    var min = parseInt(timerCount / 60);
    var sec = timerCount % 60;
    var result = min + 'M ' + sec + 'S'; //formart seconds into 00:00 
    document.getElementById('timer').innerHTML = result;
    timerCount--;
    if(timerCount < 0){
      clearInterval(timerReq);
      gameOff();
    }
  }, 1000)
}

function gameOn(){
  if(caught >= noOfFish){
    caught = 0;
    resetFish(noOfFish);
    noOfFish = Math.ceil(getRandomNumber(0, 5));
    console.log(noOfFish);
    populateFish(noOfFish);
    fishGr.forEach(animateFish);
  }
  window.requestAnimationFrame(gameOn);
}

function gameOff(){
  waveSound.pause();
  waveSound.currentTime = 0;
  document.getElementById("game").style.display = "none";
  if (score1 > highScore){
    highScore = score1;
    document.getElementById("highScore").innerHTML = highScore;
  }
  if(score2 > highScore){
    highScore = score2;
    document.getElementById("highScore").innerHTML = highScore;
  }
  document.getElementById("end").style.display = "block";
  document.getElementById("scorre1").remove();
  document.getElementById("scorre2").remove();
}

initCanvas();

function initGame(){
  waveSound.loop = true;
  waveSound.play();
  document.getElementById("start").style.display = "none";
  document.getElementById("game").style.display = "block";
  displayScore();
  displayTimer();
  caught = 0;
  score1 = 0;
  score2 = 0;
  noOfFish = 1;
  populateFish(noOfFish);
  fishGr.forEach(animateFish);
  gameOn();
}

function restart(){
  document.querySelectorAll(".fish").forEach(f => f.remove());
  resetFish();
  document.getElementById("end").style.display = "none";
  initGame();
}



// multiplayer

function initMultiGame(){
  multi();
  initGame();
}

function multi(){
  document.getElementById("boat2").style.display = "block";
  document.getElementById("fisher2").style.display = "block";
  document.getElementById("rod2").style.display = "block";
  document.getElementById("stand2").style.display = "block";
  displayPlayer2Score();
}