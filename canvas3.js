(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas,
    canvasContext,
    playerCharacter = new Image(),
    player = { // create our player object
      x: 0,
      y: 0,
      faceRight: false,
      faceLeft: false,
      faceForward: true,
      velocity: 0,
      speed: 15
    },
    offset = {
      x: 0,
      y: 0
    },
    keys=[
      keyW = false,
      keyA = false,
      keyS = false,
      keyD = false
    ],
    objects=[
      500, 1000, 1500, 2000
    ];

var characterSpriteRight = new spriteSheet('assets/right_walk_spritesheet.png', 85, 150); // path, width, height
var characterSpriteLeft = new spriteSheet('assets/left_walk_spritesheet.png', 85, 150);
var characterTransition = new spriteSheet('assets/transition_sprite.png', 96, 150);
var characterStand = new spriteSheet('assets/standing_spritesheet.png', 92, 150);
var background = new spriteSheet('assets/placeholder.png', 50, 50);

var walkRight = new Animation(characterSpriteRight, 4, 0, 6); //sprite, speed, start, end
var walkLeft = new Animation(characterSpriteLeft, 4, 0, 6);
var transitionRight = new Animation(characterTransition, 4, 0, 0);
var transitionLeft = new Animation(characterTransition, 4, 1, 1);
var stand = new Animation(characterStand, 6, 0, 11);

function onKeyDown(event) {
  var keyCode = event.keyCode;
  switch (keyCode) {
    case 68: //d -> right
      keys.keyD = true;
      if(player.velocity < player.speed)
        player.velocity++;
      offset.x -= player.velocity;
      break;
    case 83: //s -> down
      keys.keyS = true;
      break;
    case 65: //a -> left
      keys.keyA = true;
      if(player.velocity < player.speed)
        player.velocity++;
      offset.x +=player.velocity;
      break;
    case 87: //w -> up
      keys.keyW = true;
      break;
  }
}
function onKeyUp(event) {
  var keyCode = event.keyCode;
  switch (keyCode) {
    case 68: //d
      keys.keyD = false;
      player.velocity = 0;
      break;
    case 83: //s
      keys.keyS = false;
      break;
    case 65: //a
      keys.keyA = false;
      player.velocity = 0;
      break;
    case 87: //w
      keys.keyW = false;
      break;
  }
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  //event listener
  window.addEventListener('resize', resizeCanvas, false);
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('keyup', onKeyUp, false);

  resizeCanvas();
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  player.y = window.innerHeight/2;
  player.x = window.innerWidth/2;
  drawAssets();
}

function drawAssets() {
  canvasContext.save();
  canvasContext.translate(offset.x, offset.y);
  clearCanvas();

  drawBG();
  drawPlayer();
  canvasContext.restore();
  requestAnimationFrame(drawAssets);
}

function clearCanvas() {
  canvasContext.clearRect(-offset.x, -offset.y, canvas.width, canvas.height);
}

function spriteSheet(path, frameWidth, frameHeight) {
  this.image = new Image();
  this.frameWidth = frameWidth;
  this.frameHeight = frameHeight;

  // calculate the number of frames in a row after the image loads
  var self = this;
  this.image.onload = function() {
    self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
  };

  this.image.src = path;
}

function Animation(spritesheet, frameSpeed, startFrame, endFrame) {
  var animationSequence = [];  // array holding the order of the animation
  var currentFrame = 0;        // the current frame to draw
  var counter = 0;             // keep track of frame rate

  // create the sequence of frame numbers for the animation
  for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++) {
    animationSequence.push(frameNumber);
  }

  // Update the animation
  this.update = function() {
    // update to the next frame if it is time
    if (counter == (frameSpeed - 1)) {
      currentFrame = (currentFrame + 1) % animationSequence.length;
    }
    // update the counter
    counter = (counter + 1) % frameSpeed;
  };

  // draw the current frame
  this.draw = function(x, y) {
    // get the row and col of the frame
    var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
    var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);

    canvasContext.drawImage(
      spritesheet.image, // sheet
      col * spritesheet.frameWidth, row * spritesheet.frameHeight, // sx, sy
      spritesheet.frameWidth, spritesheet.frameHeight, // swidth, sheight
      x, y, // x, y
      spritesheet.frameWidth, spritesheet.frameHeight); // width, height
  };
}

function drawPlayer() {

  if (keys.keyD === true) { // right
    // update move to the right
    walkRight.update();
    walkRight.draw(player.x, player.y);
    player.faceRight = true;
  } else if (keys.keyA === true) { // left
    // update move to the left
    walkLeft.update();
    walkLeft.draw(player.x, player.y);
    player.faceLeft = true;
  } else {
    stand.update();
    stand.draw(player.x, player.y);
    if(player.faceforward === false && player.faceRight === true) {
      transitionRight.update();
      transitionRight.draw(player.x, player.y);
    } else if(player.faceforward === false && player.faceLeft === true) {
      transitionLeft.update();
      transitionLeft.draw(player.x, player.y);
    }
    player.faceRight = false;
    player.faceLeft = false;
    player.faceForward = true;
  }


}

function drawBG() {
  var objectsLength = objects.length;

  canvasContext.fillStyle = '#2d77ef';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = '#189b33';
  canvasContext.fillRect(0, player.y+145, canvas.width, 15);
  canvasContext.fillStyle = '#189b33';
  canvasContext.fillRect(0, player.y+145, 30, 50);
  canvasContext.fillStyle = '#189b33';
  canvasContext.fillRect(500, player.y+145, 30, 50);
  canvasContext.fillStyle = '#189b33';
  canvasContext.fillRect(1000, player.y+145, 30, 50);
  canvasContext.fillStyle = '#189b33';
  canvasContext.fillRect(1500, player.y+145, 30, 50);
  canvasContext.fillStyle = '#189b33';
  canvasContext.fillRect(2000, player.y+145, 30, 50);
  canvasContext.fillStyle = '#189b33';
  canvasContext.fillRect(2500, player.y+145, 30, 50);
  canvasContext.fillStyle = '#189b33';
  canvasContext.fillRect(3000, player.y+145, 30, 50);
  canvasContext.fillStyle = '#189b33';
  canvasContext.fillRect(3500, player.y+145, 30, 50);

  canvasContext.restore();
}
