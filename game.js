//http://balldroppings.com/
//http://www.3dkingdoms.com/weekly/weekly.php?a=2

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
  //log('info-bounce','remy');
  
  for(var i in this.player){
    var ball = this.ball;
    var player = this.player[i];
    if(this.ball.isCollidingHead(this.player[i])){
      //this.ball.ySpeed = -5 + this.player[i].ySpeed;
      //this.ball.xSpeed = ((this.ball.x - this.player[i].x)/2);
     
      
      var D = {'x': ball.xSpeed, 'y': ball.ySpeed};
      var N = {'x': ball.x - player.x, 'y': ball.y - player.y};
      
      
      /*var Ld = Math.sqrt(D.x*D.x + D.y*D.y);
      var Ln = Math.sqrt(N.x*N.x + N.y*N.y);
      
      D.x *= (1.0 / Ld);
      D.y *= (1.0 / Ld);
      N.x *= (1.0 / Ln);
      N.y *= (1.0 / Ln);*/
      
      //on place a l'ancienne valeur car la nouvelle est en collision
      ball.x = this.ball.xOld;
      ball.y = this.ball.yOld;
      /*ball.ySpeed = this.ball.ySpeed *-this.ball.yElastic;
      ball.xSpeed = this.ball.xSpeed *-this.ball.xElastic;
      
      
      var prodScalaire = N.x * D.x + N.y * D.y;
      var R = {x: D.x + 2*N.x*prodScalaire, y:D.y + 2*N.y*prodScalaire};
      R.x *= Ld;
      R.y *= Ld;
      console.log("x:"+R.x+" y:"+R.y);*/
      
      //Normaliser N
      var Ln = Math.sqrt(N.x*N.x + N.y*N.y);
      N.x *= (1.0 / Ln);
      N.y *= (1.0 / Ln);
      
      
      
      var vitesse = Math.sqrt(D.x*D.x + D.y*D.y);
      N.x *= vitesse;
      N.y *= vitesse;
      
      log("info-bounce", "Bounce x:"+N.x+" y:"+N.y+" vitesse:"+vitesse+ " vitesseNew:"+Math.sqrt(N.x*N.x + N.y*N.y));//+" Ld:"+1.0/Ld);//+" pdScalaire:"+prodScalaire);
      
      
      ball.xSpeed = N.x;// + player.xSpeed*1.1;
      ball.ySpeed = N.y;// + player.ySpeed*1.1;
      
      ball.xSpeed += player.xSpeed;
      //player.xSpeed *=-1 ;
      ball.ySpeed += player.ySpeed;
      //player.ySpeed *= -1;
      player.xSpeed = 0;
      player.ySpeed = 0;
      player.x = player.xOld;
      player.y = player.yOld;
      if(document.getElementById('stopCollision').checked)
        document.getElementById('stop').checked=true;
      
    }else {
      var colling = false;
      //player left
      if(ball.y+ball.radius>player.y && //top
        ball.y-ball.radius<player.y+player.height && //bottom
        ball.x+ball.radius > player.x-player.radius && //left
        ball.x-ball.radius < player.x+player.radius) //right
        
        colling = true;
      //player right
      //if(ball.x-ball.radius < player.x+player.radius) colling = true;
      
      if(colling){
        ball.x = ball.xOld;
        ball.y = ball.yOld;
        if(ball.x+ball.radius > player.x-player.radius) ball.xSpeed = 5;
        else ball.xSpeed = -5;
        ball.ySpeed = -10;
        player.x = player.xOld;
        player.y = player.yOld;
        //player.xSpeed *=-1 ;
        //player.ySpeed *=-1 ;
        
      }
      
      //this.ball.ySpeed +=0.1; //ne peux pas marcher avec le y = oldy
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
  if(document.getElementById('stop').checked) return;
  Game.update();
  Game.draw();
};

// Start the game loop
Game._intervalId = setInterval(Game.run, 1000 / Game.fps);


//ball illiminatoire




