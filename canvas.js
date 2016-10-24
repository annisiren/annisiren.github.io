(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas,
    canvasContext,
    playerCharacter = new Image(),
    player = { // create our player object
      //player image
      x: 0, // player x position
      y: 50, // player y position
      width: 81, // player width
      height: 150, // playe height
      sourceX: 0, // image source x position
      sourceY: 0, // image source y position
      //Orientation
      faceRight: true,
      faceLeft: false,
      faceForward: false,
      //Speed
      speed: 3,
      velX: 0,
      currentFrame: 0,
      frameRate: 24,
      counter: 0,
      step: 10, // frame rate
      nextStep: 0,
      endStep: 70,
      start: { // sets the start postions of our source
        rightX: 0, // start x position when facing right
        leftX: 80, // start x position when facing left
        y: 150 // start y position is the same for both
     }
    },
    keys=[
      keyW = false,
      keyA = false,
      keyS = false,
      keyD = false
    ];

function onKeyDown(event) {
  var keyCode = event.keyCode;
  switch (keyCode) {
    case 68: //d -> right
      keys.keyD = true;
      if(player.velX < player.speed){
        player.velX++;
      }
      break;
    case 83: //s -> down
      keys.keyS = true;
      break;
    case 65: //a -> left
      keys.keyA = true;
      if(player.velX < player.speed){
        player.velX--;
      }
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
      player.velX = 0;
      break;
    case 83: //s
      keys.keyS = false;
      break;
    case 65: //a
      keys.keyA = false;
      player.velX = 0;
      break;
    case 87: //w
      keys.keyW = false;
      break;
  }
}

window.onload = function() {
  console.log("onload");
  playerCharacter.src='assets/right_walk_spritesheet.png';
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
  drawAssets();
}

function drawAssets() {
   clearCanvas();
  // drawBG();
  drawPlayer();
  requestAnimationFrame(drawAssets);
}

function reset() {
  player.sy = player.start.y;
  player.counter = 0;
  player.nextStep = 0;
}

function clearCanvas() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  // Key movements
  if (keys.keyD === true) { // right
    movePlayer(0, true, false);
    player.x++;
  } else if (keys.keyS === true) { // down
    // player.y++;
  } else if (keys.keyA === true) { // left
    movePlayer(150, false, true);
    player.x--;
  } else if (keys.keyW === true) { // up
    // player.y--;
  }
  // Resets animation when facing right
  if (keys.keyD === false && player.faceRight === true) {
    player.sourceX = player.start.rightX;
    reset();
  }
  // Resets animation when facing left
  if (keys.keyA === false && player.faceLeft === true) {
    player.sourceX = player.start.leftX;
    reset();
  }

  canvasContext.drawImage(
    playerCharacter,
    player.sourceX, player.sourceY,
    player.width, player.height,
    player.x, player.y,
    player.width, player.height);
}

function movePlayer(yPos, right, left) {
  player.faceRight = right;
  player.faceLeft = left;
  if (player.counter === player.endStep) {
    console.warn("player.counter === player.endStep: ", player.counter, player.endStep);
    player.sourceX = 0;
    player.counter = 0;
    player.nextStep = player.step;
  } else if (player.counter === player.nextStep) {
    if (player.sourceY === player.start.y) {
      player.sourceX = 0;
    } else if (player.sourceY === yPos) {
      player.sourceX += player.width;
    }
    player.sourceY = yPos;
    player.nextStep += player.step;
  }
  player.counter++;
}

function drawBG() {

}
