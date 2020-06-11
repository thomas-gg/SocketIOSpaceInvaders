class Alien {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.xDir = 2;
    this.yDir = 0.5;
    this.size = 30
  }  
  move () {
    this.x += this.xDir;
    this.y += this.yDir;
    if(this.x > width || this.x < 0){
      this.xDir = -this.xDir; 
    }
    else if(this.y > height + this.size) {
      this.y = -this.size;
    }
  }
  show (){
    ellipse(this.x,this.y,this.size,this.size); 
  }
  hit (ship){
    if(ship != undefined) { 
      var d = dist(this.x, this.y, ship.x, ship.y);
      if (d < this.size/2 + 15) {
        return true;
      } else {
        return false;
      }
    }
  }
}

