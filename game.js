function log(id, text){
  document.getElementById(id).innerHTML=text;
}

var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  A: 65,
  D: 68,
  W: 87,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};


function Player(config) {
  this.xOld=0; //to calculate the vector to apply to the ball
  this.yOld=0; //to calculate the vector to apply to the ball
  this.height = 40;
  this.radius = 15;
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
  //ctx.fillRect(this.x-this.radius, this.y, this.radius*2, this.height);
  ctx.beginPath();  
  ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true); // Outer circle
  ctx.fill(); 
};

Player.prototype.moveLeft = function() {
  this.xSpeed--;
  if(this.xSpeed <= -8) this.xSpeed = -8;
   //this.x-=5;
};

Player.prototype.moveRight = function() {
  this.xSpeed++;
  if(this.xSpeed >= 8) this.xSpeed = 8;
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
 log("info-player", "Player("+this.ySpeed+")");
};

 
/*Player.prototype.fallStop = function(){
  this.isJumping = false;
  this.ySpeed = 0;
}*/

function Ball(){
  this.radius = 15;
  this.x = 200;
  this.y= 200;
  this.ySpeed = 0;
  this.xSpeed = 0;
  this.xElastic=3/4;
  this.yElastic=3/4;
};

Ball.prototype.update = function(){
  this.ySpeed +=0.5; //gravity
  
  this.xOld = this.x;
  this.yOld = this.y;
  this.x += this.xSpeed;
  this.y += this.ySpeed;
  
  //left
  if(this.x < this.radius){
    this.x=this.radius;
    this.xSpeed *=-this.xElastic;;
  }
  
  //right
  if(this.x>500-this.radius){
    this.x=500-this.radius;
    this.xSpeed *=-this.xElastic;;
  }
  
  
  if(this.y+this.radius > 400 ){
    this.ySpeed *=-this.yElastic;
    this.y = 400-this.radius;
  }
  
  //top
  if(this.y <this.radius){
    this.ySpeed *=-this.yElastic;
    this.y=this.radius;
  }
    
  //log('info-ball', 'xSpeed='+this.xSpeed+' <br />ySpeed='+this.ySpeed);
};

Ball.prototype.draw = function(ctx){
   ctx.fillStyle = '#444400';
   ctx.beginPath();  
   ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true); // Outer circle
   ctx.fill();
  
};

Ball.prototype.isColliding=function(player){
  //var x=400;
  //if(this.y+this.radius>400)
  //if(player.)
  var xcube = (this.x-player.x)*(this.x-player.x);
  var ycube = (this.y-player.y)*(this.y-player.y);
  return (Math.sqrt(xcube+ycube) < this.radius+player.radius);
  //opti multi les 2 cotés par soi xcubu+ycube
};

//Ball.prototype.colliding()



var Game = {};
Game.fps = 50;
Game.initialize = function() {
  this.entities = [];
  this.height = 400;
  this.width = 500;
  this.canvas = document.getElementById('c');
  this.context = this.canvas.getContext("2d");
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
  window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
  this.player = [
    new Player(),
    new Player({'left':Key.A,'right':Key.D,'up':Key.W, 'x':450}) 
  ];
  this.ball = new Ball();
};

Game.update = function(){
  for(var i in this.player) this.player[i].update();
  this.ball.update();
  
  for(var i in this.player){
    if(this.ball.isColliding(this.player[i])){
      //this.ball.ySpeed = -5 + this.player[i].ySpeed;
      //this.ball.xSpeed = ((this.ball.x - this.player[i].x)/2);
      
      var yImpact = (this.player.y-this.ball.y)/2; //car meme radius
      var xImpact = (this.player.x-this.ball.x)/2; //car meme radius
      //on place a l'ancienne valeur car la nouvelle est en collision
      this.ball.x = this.ball.xOld;
      this.ball.y = this.ball.yOld;
      this.ball.ySpeed = this.ball.ySpeed *-this.ball.yElastic;
      this.ball.xSpeed = this.ball.xSpeed *-this.ball.xElastic;
      
    }
  }
}

Game.draw = function(){
  this.context.fillStyle = '#d0e7f9';
  this.context.beginPath();
  this.context.rect(0, 0, this.canvas.width, this.canvas.height);
  this.context.closePath();
  this.context.fill();
  
  for(var i in this.player) this.player[i].draw(this.context);
  this.ball.draw(this.context);
};


Game.initialize();
Game.run = function() {
  Game.update();
  Game.draw();
};

// Start the game loop
Game._intervalId = setInterval(Game.run, 1000 / Game.fps);







