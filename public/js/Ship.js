function Ship(otherShip) {
  this.x = width/2;
  this.y = height-30;
  this.r = 168;
  this.g = 50;
  this.b = 50;
  this.colors = 'greenUp';
  //168,50,50 --> 168,168,50 --> 50,168,50 --> 50,168,168 --> 50,50,168 --> 168,50,168 --> repeat
  this.show = function() {
    fill(this.r,this.g,this.b);
    if(!otherShip)
      stroke(66,149,245);
    else
      stroke(255,149,245);
    strokeWeight(2)
    beginShape();
    vertex(this.x + 20, this.y + 0);
    vertex(this.x + 0, this.y + 20);
    vertex(this.x + 0, this.y + 25);
    vertex(this.x + 40, this.y + 25);
    vertex(this.x + 40, this.y + 20);
    endShape(CLOSE);
    stroke(0, 0, 0);
    strokeWeight(1)
    this.colorChange();
  }

  this.move = function() {
    if(mouseX+20 < width && mouseX > 20)
      this.x = mouseX-20;
  };
  this.colorChange = function () {
    switch(this.colors) {
      case 'greenUp':
        this.g++;
        if(this.g >= 168){
             this.colors = 'redDown';
        }
        break;
      case 'greenDown':
        this.g--;
        if(this.g <= 50){
             this.colors = 'redUp';
        }
        break;
      case 'redUp':
        this.r++;
        if(this.r >= 168){
             this.colors = 'blueDown';
        }
        break;
      case 'redDown': 
        this.r--;
        if(this.r <= 50){
             this.colors = 'blueUp';
        }
        break;
      case 'blueUp':
        this.b++;
        if(this.b >= 168){
             this.colors = 'greenDown';
        }
        break;
      case 'blueDown':
        this.b--;
        if(this.b <= 50){
             this.colors = 'greenUp';
        }
        break;
      default:
        break;
    }
  }
}
