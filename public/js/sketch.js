//socket = io.connect('http://localhost:3000'); declared in main.js
let starts = false;
let delay = 12;
let delayed = 12;
let numAliens = 8;
let playerOne = false;
let Aliens = [];
let otherBombs = [];
let score = 0;
let otherScore = 0;
let grey = [100,100,100];
let blue = [66,149,245];
let pink = [255,149,245];
let explosions = [];
let otherExplosions = [];

// check if game may start
socket.emit("start");

// Only one player creates the aliens
socket.on('playerOne', () => {
  playerOne = true;
  socket.emit("createAliens",Aliens);
});

// on disconnect reset variables
socket.on('dc', () => {
  playerOne = false;
  starts = false;
  Aliens = [];
  otherBombs = [];
  Bombs = [];
  score = 0; 
  otherScore = 0;
  setup();
});

// overwrite the x and y positions of each alien to match the server and begin
socket.on('begin',(aliens) => {
  for(let i = 0; i < numAliens; i++){
    if(aliens[i] != undefined && Aliens[i] != undefined){
      Aliens[i].x = aliens[i].x;
      Aliens[i].y = aliens[i].y;
    }
  }
  starts = true;
});

// update otherShip, otherBombs, and otherAliens (from server)
socket.on('updated', (data) => {
  
  // the server has less aliens reset them
  while(data.Aliens.length < Aliens.length){
    Aliens.splice(Aliens.length-1,1);
    for(let i = 0; i < data.Aliens.length; i++){
      Aliens[i].x = data.Aliens[i].x;
      Aliens[i].y = data.Aliens[i].y;
      Aliens[i].xDir = data.Aliens[i].xDir;
      Aliens[i].yDir = data.Aliens[i].yDir;
    }
  }
  
  // if other ship exists move it
  if(data.ship != undefined) {
    otherShip.x = data.ship.x;
  }
  else {
    otherShip = undefined;
  }
  
  // push all of the server's bombs into otherBombs
  for(let i = 0; i < data.Bombs.length; i++){
    extraBomb = {
      x:data.Bombs[i].x,
      y:data.Bombs[i].y,
      sizeX:data.Bombs[i].sizeX,
      sizeY:data.Bombs[i].sizeY
    }
    otherBombs.push(extraBomb);
  }

  // push otherExplosions
  for(let w = 0; w < data.explosions.length; w++) {
    if(otherExplosions[w] == undefined){
      let explosion = new Explosion(data.explosions[w].x,data.explosions[w].y);
      otherExplosions.push(explosion);
    }
  } 

  otherScore = data.score;
});

// resize the window * taken out because of aliens being out of width *
//function windowResized() {
  //var useWidth = document.getElementById("chat-header").offsetWidth;
  //resizeCanvas(useWidth, 500);
//}

function setup() {
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
  background('#222222');
  if(!starts){
    return;
  }
  let string = [
    ["score: ", grey],
    [score + " ", blue],
    [otherScore , pink],
  ];
  drawtext(10, 20, string );
  fill(100,100,100)

  // if other ship exists and no aliens exist play again
  if(Aliens.length == 0 && otherShip != undefined && ship != undefined){
    for(let i = 0; i < numAliens; i++){
      let a = new Alien(random(0,width),random(0,height/2),20);
      Aliens.push(a);
    }
    socket.emit("start");
  }
  else {
    // show & move Aliens
    for(let i = 0; i < Aliens.length; i++) {
      Aliens[i].show();
      Aliens[i].move(); 
      if(Aliens[i].hit(ship)){
        ship = undefined;
        Aliens.splice(i,1);
        i--;
      }
    }
  }

  // show and reset other player's bombs
  fill(pink); 
  for(let i = 0; i < otherBombs.length; i++) {
    ellipse(otherBombs[i].x,otherBombs[i].y,otherBombs[i].sizeX,otherBombs[i].sizeY);
  }
  otherBombs = [];

  // show and reset other player's explosions
  for(let i = 0; i < otherExplosions.length; i++) {
    if(otherExplosions[i].show()){
      otherExplosions.splice(i,1);
      i--;
    }
  }

  // show and move player's bombs
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
        let explosion = new Explosion(Aliens[w].x,Aliens[w].y)
        explosions.push(explosion);
        Aliens.splice(w,1);
        Bombs.splice(i,1);
        w--;
        i--;
        score++;
        break;
      }
    }
  }
   // explosion draw
   for(let w = 0; w < explosions.length; w++) {
    if(explosions[w].show()){
      explosions.splice(w,1);
      w--;
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

  // emit updates
  let data = { 
    Aliens: Aliens,
    Bombs: Bombs,
    ship: ship,
    explosions: explosions,
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
  let pos_x = x;
  for ( let i = 0; i < text_array.length; ++ i ) {
    let part = text_array[i];
    let t = part[0];
    let c = part[1];
    let w = textWidth( t );
    fill( c );
    text( t, pos_x, y);
    pos_x += w;
  }
}