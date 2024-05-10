(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas,
    ctx,
    playerCharacter = new Image(),
    player = { // create our player object
      x: 0,
      y: 0,
      faceRight: false,
      faceLeft: false,
      faceForward: true,
      velocity: 0,
      speed: 15,
      maxLeft: 50,
      maxRight: 150
    },
    offset = {
      x: 0,
      y: 0,
      right: null
    },
    canvasSize = 3000;
    keys=[
      keyW = false,
      keyA = false,
      keyS = false,
      keyD = false
    ];

var characterSpriteRight = new spriteSheet('assets/right_walk_spritesheet.png', 85, 150); // path, width, height
var characterSpriteLeft = new spriteSheet('assets/left_walk_spritesheet.png', 85, 150);
var characterTransition = new spriteSheet('assets/transition_sprite.png', 96, 150);
var characterStand = new spriteSheet('assets/standing_spritesheet.png', 92, 150);
var monkey = new spriteSheet('assets/Sprite-Monkey-Stand.png', 80, 112);
var guide = new spriteSheet('assets/Sprite-Guide.png',150, 75);
var birch = new spriteSheet('assets/Sprite-Tree-Birch.png', 300, 250);
var cloud1 = new spriteSheet('assets/Sprite-Cloud-1.png', 150, 250);
var cloud2 = new spriteSheet('assets/Sprite-Cloud-2.png', 150, 250);
var cloud3 = new spriteSheet('assets/Sprite-Cloud-3.png', 150, 250);

var background = new spriteSheet('assets/placeholder.png', 50, 50);

var walkRight = new Animation(characterSpriteRight, 4, 0, 6); //sprite, speed, start, end
var walkLeft = new Animation(characterSpriteLeft, 4, 0, 6);
var transitionRight = new Animation(characterTransition, 4, 0, 0);
var transitionLeft = new Animation(characterTransition, 4, 1, 1);
var stand = new Animation(characterStand, 6, 0, 11);

var backgroundStills = new Animation(background, 0, 0, 24);

function onKeyDown(event) {
  var keyCode = event.keyCode;
  switch (keyCode) {
    case 68: //d -> right
      keys.keyD = true;
      break;
    case 83: //s -> down
      keys.keyS = true;
      break;
    case 65: //a -> left
      keys.keyA = true;
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
  ctx = canvas.getContext('2d');

  //event listener
  window.addEventListener('resize', resizeCanvas, false);
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('keyup', onKeyUp, false);


  // setInterval(function(){ triggerEvents(); }, 2000);

  resizeCanvas();
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  player.y = window.innerHeight-250;
  player.x = window.innerWidth/2;
  drawAssets();
}

function drawAssets() {
  ctx.save();
  if(offset.x < 0 || offset.x < -canvasSize+(window.innerWidth/2)) {
    // console.log("offset translate");
    ctx.translate(offset.x, offset.y);
  }
  clearCanvas();

  drawBG();
  drawPlayer();

  ctx.restore();
  requestAnimationFrame(drawAssets);
}

function clearCanvas() {
  ctx.clearRect(-offset.x, -offset.y, canvas.width, canvas.height);
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

    ctx.drawImage(
      spritesheet.image, // sheet
      col * spritesheet.frameWidth, row * spritesheet.frameHeight, // sx, sy
      spritesheet.frameWidth, spritesheet.frameHeight, // swidth, sheight
      x, y, // x, y
      spritesheet.frameWidth, spritesheet.frameHeight); // width, height
  };

  // draw still frame
  this.drawStill = function(x, y, frame) {
    var row = Math.floor(animationSequence[frame] / spritesheet.framesPerRow);
    var col = Math.floor(animationSequence[frame] % spritesheet.framesPerRow);
    ctx.drawImage(
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
    if (offset.right && offset.right > (window.innerWidth/2) - player.maxRight) { //stop at max offset
      console.log("update at most right end");
      stand.update();
      stand.draw(player.x+offset.right, player.y);
    } else {
      if(player.velocity < player.speed)
        player.velocity++;

      if(offset.x <= 0 && offset.x > (window.innerWidth/2)-canvasSize) { // normal walk
        console.log("normal walk right", offset.x, offset.right);
        offset.x -= player.velocity;
        walkRight.update();
        walkRight.draw(player.x, player.y);
      } else if(offset.x > 0) { // left most section
        console.log("left walk right", offset.x, offset.right);
        offset.x -= player.velocity;
        walkRight.update();
        walkRight.draw(player.x-offset.x, player.y);
      } else if (offset.x <= (window.innerWidth/2)-canvasSize) { // right most section
        console.log("right walk right", offset.x, offset.right);
        offset.right +=player.velocity;
        walkRight.update();
        walkRight.draw(player.x+offset.right, player.y);
      }
      // if(offset.right < 0) {
      //   console.log("offset set");
      //   // offset.x = (window.innerWidth/2)-canvasSize;
      // }
      player.faceRight = true;
    }
  } else if (keys.keyA === true) { // left
    // top player moving left
    if (offset.x > (window.innerWidth/2) - player.maxLeft){ // stop at max offset
      console.log("update at most left end");
      stand.update();
      stand.draw(player.x-offset.x, player.y);
    } else { // move player left
      if(player.velocity < player.speed)
        player.velocity++;

      if(!offset.right) {
        offset.x +=player.velocity;
      }

      if(offset.x <= 0  && offset.x >= (window.innerWidth/2)-canvasSize) { // normal walk left
        console.log("normal walk left", offset.x, offset.right);

        walkLeft.update();
        walkLeft.draw(player.x, player.y);
      } else if (offset.x > 0) { // left most section
        console.log("left walk left", offset.x, offset.right);
        // offset.x +=player.velocity;
        walkLeft.update();
        walkLeft.draw(player.x-offset.x, player.y);
      } else if (offset.x < (window.innerWidth/2)-canvasSize){ // right most section  if(offset.right > 0)
        console.log("right walk left", offset.x, offset.right);
        offset.right -=player.velocity;
        walkLeft.update();
        walkLeft.draw(player.x+offset.right, player.y);
      }
      if(offset.right <= 0 && offset.right) {
        console.log("right null");
        offset.right = null;
        // offset.x = (window.innerWidth/2)-canvasSize;
      }
      player.faceLeft = true;
    }
  } else {

    if(offset.x > 0) { // between 0 and left
      stand.update();
      stand.draw(player.x-offset.x, player.y);
    } else if(offset.right > 0) { // between last canvas size/2 and right
      stand.update();
      stand.draw(player.x+offset.right, player.y);
    } else if(offset.x < 0  && offset.right <= 0) { // between 0 and - offset
      stand.update();
      stand.draw(player.x, player.y);
    } else { // otherwise stand
      stand.update();
      stand.draw(player.x-offset.x, player.y);
    }
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
  for(var i=0; i < canvas.width-offset.x; i+=50) {
    backgroundStills.drawStill(i, player.y+146, 5);
    backgroundStills.drawStill(i, player.y+146+50, 10);
    backgroundStills.drawStill(i, player.y+146+50+20, 10);
  }

  ctx.fillStyle = '#189b33';
  ctx.fillRect(1719, player.y+200, 30, 100);

  ctx.fillStyle = '#189b33';
  ctx.fillRect(player.x+241, player.y+200, 30, 100);

  ctx.restore();
}

function triggerEvents() {
  console.log("TriggerEvents");
  if (offset.x > (window.innerWidth/2) - player.maxLeft){
    console.log("TriggerEvents: offset.x > (window.innerWidth/2) - player.maxLeft");
    // setInterval(, 50000);
     moveRightEvent();
    // var moveInterval = setInterval(function(){ }, 1000);
  }

  // clearInterval(moveInterval);d
}

function moveRightEvent() {
  console.log("moveRightEvent");
  console.log(offset.x, " > ", (window.innerWidth/2) - player.maxLeft );

}
