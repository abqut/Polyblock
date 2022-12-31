var playerPosition;
var barSpeed;
var dir;
var barLength;
var playField;
var blocks;
var ball;
var start;
var ballRad;
var ballSpeed;
var ballAngle;
var afterImageN;
var afterImage; 
var globalRot;
var lives;
var origLives;
var win;
var ballColor;
var bgColor;

/* 
this game is heavily inspired by Yining Shi's brick breaker game: https://youtu.be/5kEPixL8JoU

font is from google fonts: https://fonts.google.com/share?selection.family=Nunito:wght@600
*/
let myFont;
function preload() {
  myFont = loadFont('/nunito.ttf');
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function distance(x1, y1, x2, y2){
  return sqrt((x2 - x1) * (x2 - x1) + (y1 - y2) * (y1 - y2));
}

function setup() {
  createCanvas(1000, 1000);
  textFont(myFont);
  let fps = 50;
  frameRate(fps);
  playerPosition = width / 2;
  barSpeed = 20;
  barLength = 140;
  playField = [width, 2 * height / 3]; 
  start = false;
  ballRad = 40;
  ballAngle = PI / 2 ;
  ball = [width / 2 - barLength / 2, height - (40 + ballRad / 2)];
  ballSpeed = 10;;
  ballColor = [255,193,204];
  afterImage = [];
  afterImageN = 5;
  globalRot = 0;
  lives = 3;
  bgColor = 255;
  win = false;
  origLives = lives;
  for(let i = 0; i < afterImageN; i++){
    afterImage[i] = ball;
  }
  
  
  blocks = [];
  var pos = [];
  var count = 0;
  for(let k = 100; k < playField[0] - 140; k += 140){
    for(let j = 100; j < playField[1] - 140; j += 140){
      pos[count] = [k, j];
      count++;
    }
  }


  for(let i = 0; i < 10; i++){
    let points = 6;
    let radius = Math.random() * 50 + 20;
    let posIndex = getRandomInt(count);
    let polyPos = pos[posIndex];
    let rot = Math.random() * 10;
    let rot0 = Math.random() * (PI / 3);
    pos.splice(posIndex, 1);
    blocks[i] = [polyPos[0] + getRandomInt(70), polyPos[1] + getRandomInt(70), radius, i + 3, getRandomInt(255), getRandomInt(255), getRandomInt(255), rot, rot0];
    count--;
  }


}

function collideBlocks(){
  for(let i = 0; i < blocks.length; i++) {
    ele = blocks[i];
    if(distance(ele[0], ele[1], ball[0], ball[1]) <= ballRad/2 + ele[2]){
      blocks.splice(i, 1);
      ballAngle = -ballAngle;
    }
  }
}

function mylerp(a, b ,t){
  return ((1-t) * a + t * b);
}

function collideBar(){
  if((playerPosition - ballRad/2 < ball[0] &&  ball[0] < playerPosition + barLength + ballRad/2) && ((height - 40 - ballRad/2 < ball[1] &&  ball[1] < height - 20 + ballRad/2 ))){
    ballAngle = mylerp(PI, 0, (ball[0] - playerPosition) / barLength);
  }
}


function draw() {
  background(color(bgColor));
  stroke(color(210));
  noFill();
  rect(2,2,width - 3, height - 3);
  if(!win){globalRot = (globalRot + 0.002) % TWO_PI;
  if(!start){
    ball = [playerPosition + ((barLength ) / 2 - 1), height - (40 + ballRad / 2)];
    for(let i = 0; i < afterImageN; i++){
      afterImage[i] = ball;
    }
    textSize(50);
    fill(color(244, 194, 194));
    stroke(color(244, 194, 194));
    textAlign(0, CENTER);
    text("lives", 230, 50);

    fill(color(240));
    stroke(color(244, 194, 194));
    rect(10, 10, 215, 80)
    
  }
  else{

    afterImage.unshift(ball.slice());
    afterImage.splice(afterImageN,1);
    ball[0] += ballSpeed *  cos(ballAngle);
    ball[1] -= ballSpeed *  sin(ballAngle);
    if(ball[0] - ballRad / 2 <=  0){
      ball[0] = ballRad ;
      ballAngle = PI  - ballAngle;
    }
    else if(ball[0] + ballRad / 2 >= width){
      ball[0] = width - (ballRad / 2);
      ballAngle = PI  - ballAngle;
    }
    else if(ball[1] + ballRad / 2 > height){
      ball[1] = height - (ballRad);
      ballAngle =  - ballAngle;
      lives--;
      if(lives == 0){
        setup();
      }
    }
    else if(ball[1] - ballRad / 2 < 0){
      ball[1] = ballRad / 2;
      ballAngle =  - ballAngle;

    }
  collideBlocks();
  collideBar();
  if(blocks.length == 0){
    win = true;
    }

  }

  stroke(color(91, 206, 250));
  fill(color(240));
  rect(playerPosition, height - 40, barLength, 20);
  stroke(color(ballColor[0], ballColor[1], ballColor[2]));
  fill(color(ballColor[0], ballColor[1], ballColor[2]))
  circle(ball[0], ball[1], ballRad);
  if(start){
    for(let i = 0; i < afterImageN; i++){
      element = afterImage[i];
      stroke(color(mylerp(ballColor[0], bgColor,i / (afterImageN - 1) ), mylerp(ballColor[1], bgColor,i / (afterImageN - 1) ), mylerp(ballColor[2], bgColor,i / (afterImageN - 1) )));//
      fill(color(mylerp(ballColor[0], bgColor,i / (afterImageN - 1)), mylerp(ballColor[1], bgColor,i / (afterImageN - 1) ), mylerp(ballColor[2], bgColor,i / (afterImageN - 1) )));
      circle(element[0], element[1], ballRad);
    }
  }
  blocks.forEach(ele => {
    push();
    translate(ele[0], ele[1]);
    rotate((ele[8] + ele[7] * globalRot) % TWO_PI);
    stroke(color(ele[4], ele[5], ele[6]));
    noFill();
    polygon(0, 0, ele[2], ele[3])
    pop();
  });

  for(let j = 0; j < lives; j++){
    push();
    translate(45 + j * 70, 50);
    rotate((1.3 * globalRot) % TWO_PI);
    stroke(color(40));
    fill(color(mylerp(244, 91, j / (origLives - 1)), mylerp(194, 206, j / (origLives - 1)), mylerp(194, 250, j / (origLives - 1)))) //5BCEFA
    polygon(0, 0, 30, 6 + j)
    pop();
  }
  if(keyIsPressed){
    playerPosition = min(max(playerPosition + dir, 5), width - (barLength + 5));
  }
  else{
    dir = 0;
  }
  }
  else{
    textSize(80);
    fill(0, 102, 153);
    textAlign(CENTER, CENTER);
    text("You Won!", width / 2, height / 2);
  }
}

function keyPressed(){
  if(key == 'a'){
    dir = - barSpeed;
  }
  else if(key == 'd'){
    dir = barSpeed;
  }
  else if(key == ' '){
    if(!start){
      start = true;
    }
    else if(win){
      setup();
    }
  }
}
