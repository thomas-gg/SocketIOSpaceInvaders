class Bomb {
  constructor (x,y){
    this.x = x;
    this.y = y;
    this.sizeX = 10;
    this.grow = 1;
  }
  move() {
    this.y -= 5;
  }
  show() { 
    ellipse(this.x,this.y,this.sizeX,this.sizeX); 
    this.sizeX += this.grow;
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

 