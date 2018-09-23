function Ball(){
  this.radius = 15;
  this.x = 200;
  this.y= 200;
  this.ySpeed = 4;
  this.xSpeed = 0;
  this.xElastic=3/4;
  this.yElastic=3/4;
};

Ball.prototype.update = function(){
  this.ySpeed +=0.3; //gravity
  
  this.xOld = this.x;
  this.yOld = this.y;
  this.x += this.xSpeed;
  this.y += this.ySpeed;
  
  //left
  if(this.x < this.radius){
    this.x=this.radius;
    this.xSpeed *=-this.xElastic;
  }
  
  //right
  if(this.x>500-this.radius){
    this.x=500-this.radius;
    this.xSpeed *=-this.xElastic;;
  }
  
  //up
  if(this.y+this.radius > 400 ){
    this.ySpeed *=-this.yElastic;
    this.y = 400-this.radius;
  }
  
  //top
  if(this.y <this.radius){
    this.ySpeed *=-this.yElastic;
    this.y=this.radius;
  }
    
  log('info-ball', 'Ball xSpeed='+this.xSpeed+' ySpeed='+this.ySpeed);
};

Ball.prototype.draw = function(ctx){
   ctx.fillStyle = '#444400';
   ctx.beginPath();  
   ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true); // Outer circle
   ctx.fill();
   
   //draw vector
   ctx.strokeStyle = '#f00';
   ctx.moveTo(this.x,this.y);
   ctx.lineTo(this.x+this.xSpeed*5,this.y+this.ySpeed*5);
   ctx.stroke();
  
};

Ball.prototype.isCollidingHead=function(player){
  //var x=400;
  //if(this.y+this.radius>400)
  //if(player.)
  var xcube = (this.x-player.x)*(this.x-player.x);
  var ycube = (this.y-player.y)*(this.y-player.y);
  return (Math.sqrt(xcube+ycube) < this.radius+player.radius);
  //opti multi les 2 cotés par soi xcubu+ycube
};