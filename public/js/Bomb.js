class Bomb {
  constructor (x,y){
    this.x = x;
    this.y = y;
    this.sizeX = 10;
    this.sizeY = 10;
    this.grow = 1;
  }
  move() {
    this.y -= 5;
  }
  show() {
    fill(66,149,245); 
    ellipse(this.x,this.y,this.sizeX,this.sizeY); 
    this.sizeX += this.grow;
    this.sizeY += this.grow;
    if(this.sizeX > 20 || this.sizeX < 5){
         this.grow = -this.grow;
    }
  }
  hit(alien) {
    // since they both are circles
    var d = dist(this.x, this.y, alien.x, alien.y);
    if (d < this.sizeX/2 + alien.size/2) {
      return true;
    } else {
      return false;
    }
  }
}

 