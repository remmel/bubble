function Player(config) {
  this.xOld=0;
  this.yOld=0;
  this.height = 40;
  this.radius = 30;
  this.x = 40;
  this.xSpeed = 0;
  this.y = 300;
  this.ySpeed = 0;
  this.isJumping = true; 
  
  this.left = Key.LEFT;
  this.right = Key.RIGHT;
  this.up = Key.UP;
     
  for (var name in config)
    this[name]=config[name];

}

Player.prototype.draw = function(ctx) {
  ctx.fillStyle = '#000000';

  ctx.beginPath();  
  ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true); // Outer circle
  ctx.fill(); 

  ctx.strokeStyle = '#000';
  ctx.fillRect(this.x-this.radius, this.y, this.radius*2, this.height);
  
  //draw vector
  ctx.strokeStyle = '#f00';
  ctx.moveTo(this.x,this.y);
  ctx.lineTo(this.x+this.xSpeed*5,this.y+this.ySpeed*5);
  ctx.stroke();
};

Player.prototype.moveLeft = function() {
  this.xSpeed--;
  if(this.xSpeed <= -6) this.xSpeed = -6;
   //this.x-=5;
};

Player.prototype.moveRight = function() {
  this.xSpeed++;
  if(this.xSpeed >= 6) this.xSpeed = 6;
  //this.x+=5;
 };
 
Player.prototype.update = function() {
  if (Key.isDown(this.up)) this.jump();
  if (Key.isDown(this.left)) this.moveLeft();
  if (Key.isDown(this.right)) this.moveRight();
  if(!Key.isDown(this.left) && !Key.isDown(this.right)) this.xSpeed =0;
  
  this.xOld = this.x;
  this.yOld = this.y;
  this.x += this.xSpeed;
  this.y += this.ySpeed;
   
  if(this.isJumping) this.checkJump();   
};
 
Player.prototype.jump = function(){
  if(!this.isJumping){
    this.isJumping = true;
    this.ySpeed = -15;
  }
};
 
Player.prototype.checkJump = function(){
 this.ySpeed++;
 if(this.y + this.height> 400){
   this.isJumping = false;
   this.ySpeed = 0;
   this.y = 400 - this.height;
 }
 //log("info-player", "Player("+this.ySpeed+")");
};



 
/*Player.prototype.fallStop = function(){
  this.isJumping = false;
  this.ySpeed = 0;
}*/

