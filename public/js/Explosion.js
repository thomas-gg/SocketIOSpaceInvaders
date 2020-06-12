function Explosion(x,y){
  this.x = x;
  this.y = y;
  this.sizeX = 10;
  this.sizeY = 10;
  this.grow = 1;
  this.timer = 0;
  this.show = function() {
    fill(240, 108, 7)
    ellipse(this.x,this.y,this.sizeX,this.sizeY); 
    this.sizeX += this.grow;
    this.sizeY += this.grow;
    if(this.timer > 20){
       return true; 
    }
    this.timer++;
    return false;
  }
}
