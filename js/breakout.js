//Run code once the DOM has loaded...
$(document).ready(function() {
    var myCanvas = document.getElementById("myCanvas");
    var ctx = myCanvas.getContext("2d");

    var score = 0;
    var gameStart = false;

    //--Variables for bricks --
    var brickRowCount   = 4;
    var brickColCount   = 5;
    var brickWidth      = 75;
    var brickHeight     = 20;
    var brickPadding    = 10;
    var brickOffsetTop  = 30;
    var brickOffsetLeft = 30;

    var bricks = [];
    for(i=0; i<brickColCount; i++) {
      bricks[i] = [];
      for(j=0; j<brickRowCount; j++) {
        bricks[i][j] = { x: 0, y: 0, status: 1 };
      }
    }

    //-- Variables for ball --
    var ballRadius = 10;

    var x  = myCanvas.width/2;
    var y  = myCanvas.height-30;
    var dx = 2;
    var dy = -2;

    //-- Variables for paddle --
    var paddleHeight = 10;
    var paddleWidth  = 75;
    var paddleX      = (myCanvas.width-paddleWidth)/2; //amount of movement left and right for paddle

    var rightPressed = false;
    var leftPressed  = false;

    function drawScore() {
      ctx.font = "bold 16px Veranda";
      ctx.fillStyle = "#ff6600";
      ctx.fillText("Score: "+score, 8, 20);
    }
    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI*2);
      ctx.fillStyle = "#FF00F0";
      ctx.fill();
      ctx.closePath();
    }
    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(paddleX, myCanvas.height-paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#FF00F0";
      ctx.fill();
      ctx.closePath();
    }
    function drawBricks() {
      for(i=0; i<brickColCount; i++) {
        for(j=0; j<brickRowCount; j++) {
          if(bricks[i][j].status == 1) {
            var brickX = (i*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (j*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[i][j].x = brickX;
            bricks[i][j].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#ff6600";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }
    function draw() {
      ctx.clearRect(0,0,myCanvas.width, myCanvas.height); //clear canvas before drawing a new frame
      drawScore();
      drawBricks();
      drawPaddle();
      collisionDetection();
      drawBall();

      if(x+dx > myCanvas.width - ballRadius || x +dx < ballRadius) {
        dx = -dx;
      }
      if(y+dy < ballRadius) {
        dy = -dy;
      } else if(y+dy > myCanvas.height-ballRadius) {
        //"bounce" off paddle
        if(x > paddleX && x < paddleX+paddleWidth) {
          dy = -dy;
        }
        else {
          alert("Game Over");
          document.location.reload();
        }
      }

      if(rightPressed && paddleX < myCanvas.width-paddleWidth) {
        paddleX += 7;
      } else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
      }

      x += dx;
      y += dy;
    }

    //-- Event handling for key presses --
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    function keyDownHandler(e) {
      if(gameStart == false) {
        setInterval(draw, 15);
        gameStart = true;
      }
      if(e.keyCode == 39) {
        rightPressed = true;
      }
      if(e.keyCode == 37) {
        leftPressed = true;
      }
    }
    function keyUpHandler(e) {
      if(gameStart == false) {
        setInterval(draw, 15);
        gameStart = true;
      }
      if(e.keyCode == 39) {
        rightPressed = false;
      }
      if(e.keyCode == 37) {
        leftPressed = false;
      }
    }
    function collisionDetection() {
      for(i=0; i<brickColCount; i++) {
        for(j=0; j<brickRowCount; j++) {
          var b = bricks[i][j];
          if(b.status == 1) {
            if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
              dy = -dy;
              b.status = 0;
              score += 10;
              if(score == brickRowCount*brickColCount*10) {
                alert("Congratulations, you win!");
                document.location.reload();
              }
            }
          }
        }
      }
    }
    draw();
});

