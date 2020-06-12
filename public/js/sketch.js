//socket = io.connect('http://localhost:3000'); declared in main.js
let starts = false;
let delay = 12;
let delayed = 12;
let numAliens = 8;
let playerOne = false;
var Aliens = [];
var otherBombs = [];
let score = 0;
let otherScore = 0;

socket.emit("start");
socket.on('playerOne', () => {
  playerOne = true;
  socket.emit("createAliens",Aliens);
});
socket.on('dc', () => {
  playerOne = false;
  starts = false;
  Aliens = [];
  otherBombs = [];
  Bombs = [];
  setup();
});
socket.on('begin',(aliens) => {
  for(let i = 0; i < numAliens; i++){
    if(aliens[i] != undefined){
      Aliens[i].x = aliens[i].x;
      Aliens[i].y = aliens[i].y;
    }
  }
  //console.log(`:x: ${Aliens[0].x}`)
  //console.log(`skmdclsmd ${Aliens} ksdncksnd ${playerOne} skml`)
  starts = true;
});
socket.on('updated', (data) => {
  while(data.Aliens.length < Aliens.length){
    Aliens.splice(Aliens.length-1,1);
    for(let i = 0; i < data.Aliens.length; i++){
      Aliens[i].x = data.Aliens[i].x;
      Aliens[i].y = data.Aliens[i].y;
      Aliens[i].xDir = data.Aliens[i].xDir;
      Aliens[i].yDir = data.Aliens[i].yDir;
    }
  }
  if(data.ship != undefined) {
    otherShip.x = data.ship.x;
  }
  else {
    otherShip = undefined;
  }
  for(let i = 0; i < data.Bombs.length; i++){
    Bomby = {
      x:data.Bombs[i].x,
      y:data.Bombs[i].y,
      sizeX:data.Bombs[i].sizeX,
      sizeY:data.Bombs[i].sizeY
    }
    otherBombs.push(Bomby);
    otherScore = data.score;
  }
});

//function windowResized() {
  //var useWidth = document.getElementById("chat-header").offsetWidth;
  //resizeCanvas(useWidth, 500);
//}

function setup() {
  //var useWidth = document.getElementById("chat-header").offsetWidth;
  //var canvas = createCanvas(1100, 500); 
  var canvas = createCanvas(700, 500); 
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  ship = new Ship(false);
  otherShip = new Ship(true);
  for(let i = 0; i < numAliens; i++){
    let a = new Alien(random(0,width),random(0,height/2),20);
    Aliens.push(a);
  }
  Bombs = [];
  textSize(20);
}

function draw() {
  background('#222222'); // Draw once to give a little color
  if(!starts){
    return;
  }
  var grey = [100,100,100];
  var blue = [66,149,245];
  var pink = [255,149,245];
  var string = [
    ["score: ", grey],
    [score + " ", blue],
    [otherScore , pink],
  ];
  drawtext(10, 20, string );
  fill(100,100,100)

  // if other ship play again
  if(Aliens.length == 0 && otherShip != undefined && ship != undefined){
    for(let i = 0; i < numAliens; i++){
      let a = new Alien(random(0,width),random(0,height/2),20);
      Aliens.push(a);
    }
    socket.emit("start");
  }

  // show Aliens
  for(let i = 0; i < Aliens.length; i++) {
    Aliens[i].show();
    Aliens[i].move(); 
    if(Aliens[i].hit(ship)){
      ship = undefined;
      Aliens.splice(i,1);
      i--;
    }
  }

  fill(pink); 
  for(let i = 0; i < otherBombs.length; i++) {
    ellipse(otherBombs[i].x,otherBombs[i].y,otherBombs[i].sizeX,otherBombs[i].sizeY);
  }
  otherBombs = [];

  for(let i = 0; i < Bombs.length; i++) {
    fill(30,30,30);
    Bombs[i].show();
    Bombs[i].move(); 
    
    // bomb goes above screen
    if(Bombs[i].y < 0){
      Bombs.splice(i,1);
      i--;
      break;
    }
    
    // bomb hits Alien
    for(let w = 0; w < Aliens.length; w++) {
      if(Bombs[i].hit(Aliens[w])){
        Aliens.splice(w,1);
        Bombs.splice(i,1);
        w--;
        i--;
        score++;
        break;
      }
    }
  }
  delayed++;

 /* if (keyIsPressed === true && key === ' ' && delayed >= delay && ship != undefined) {
      ball = new Bomb(ship.x+20,ship.y+20);  
      Bombs.push(ball);   
      delayed = 0;
  }*/  
  if(ship != undefined){
    ship.show();
  }
  if(otherShip != undefined){
    otherShip.show();
  }
  //socket.emit("update",Aliens,Aliens.length,Bombs,Bombs.length,ship);
  let data = { 
    Aliens: Aliens,
    Bombs: Bombs,
    ship: ship,
    score: score
  }
  socket.emit("update",data);
}

function mouseMoved() {
  if(ship != undefined){
    ship.move(); 
  }
}

// for mobile (on chrome)
function mouseDragged() {
  if(ship != undefined){
    ship.move(); 
  }
}
function touchStarted() {
  if(delayed >= delay && ship != undefined) {
      ball = new Bomb(ship.x+20,ship.y+20);  
      Bombs.push(ball);  
      delayed = 0;
  }
}

function drawtext( x, y, text_array ) {
  
  var pos_x = x;
  for ( var i = 0; i < text_array.length; ++ i ) {
      var part = text_array[i];
      var t = part[0];
      var c = part[1];
      var w = textWidth( t );
      fill( c );
      text( t, pos_x, y);
      pos_x += w;
  }
}