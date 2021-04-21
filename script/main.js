var HEAD_SELECTOR = '[data-object-role = "fangs"]';
var BODY_SELECTOR = '[data-object-role = "body"]';
var FOOD_SELECTOR = '[data-object-role = "food"]';

function getHead() {
  'use strict';
  var head = document.querySelector(HEAD_SELECTOR);
  return head;
}

function getBody() {
  var body = document.querySelectorAll(BODY_SELECTOR);
  return body;
}

function getFood() {
  var food = document.querySelector(FOOD_SELECTOR);
  return food;
}

function getXPos(node) {
  var xPos = window.getComputedStyle(node).getPropertyValue("left");
  var xPos1 = parseInt(xPos.slice(0, xPos.length - 2));
  return xPos1;
}

function getYPos(node) {
  var yPos = window.getComputedStyle(node).getPropertyValue("top");
  var yPos1 = parseInt(yPos.slice(0, yPos.length - 2));
  return yPos1;
}

function getWidth(element) {
  let width = window.getComputedStyle(element).getPropertyValue("width");
  let width2 = parseInt(width.slice(0, width.length - 2));
  return width2;
}

function getHeight(element) {
  let height = window.getComputedStyle(element).getPropertyValue("height");
  let height2 = parseInt(height.slice(0, height.length - 2));
  return height2;
}

function getPosArr() {
  let posArr = [];
  for (i = 0; i < getBody().length; i++) {
    posArr[i] = [getXPos(getBody()[i]), getYPos(getBody()[i])];
  }
  return posArr;
}

var xPos1 = getXPos(getHead());
var yPos1 = getYPos(getHead());
var rightTimingVar, leftTimingVar, upTimingVar, downTimingVar;
var lastXPos1, lastYPos1, lastXPos2, lastYPos2;
var foodX, foodY;
var nodeArray = document.querySelectorAll(".node");
var score = 0;

function updateScore() {
  score += 5;
  document.querySelector(".score-board").textContent = "Score: " + score;
}

function followPrevNode() {
  lastXPos1 = getXPos(getHead());
  lastYPos1 = getYPos(getHead());
  for (i = 1; i < nodeArray.length; i++) {
    lastXPos2 = getXPos(nodeArray[i]);
    lastYPos2 = getYPos(nodeArray[i]);
    nodeArray[i].style.left = lastXPos1 + "px";
    nodeArray[i].style.top = lastYPos1 + "px";
    lastXPos1 = lastXPos2;
    lastYPos1 = lastYPos2;
  }
}

function createNode() {
  let node = document.createElement("div");
  let text = document.createTextNode("O");
  node.classList.add("node");
  node.classList.add("body");
  node.appendChild(text);
  node.setAttribute("data-object-role", "body");
  node.style.left = lastXPos1 + "px";
  node.style.top = lastYPos1 + "px";
  return node;
}

function attachNode() {
  document.querySelector("snake").appendChild(createNode());
  nodeArray = document.querySelectorAll(".node");
}

function bitesItself() {
  let headX = getXPos(getHead());
  let headY = getYPos(getHead());
  let bites = false;
  let posArr = getPosArr();
  for (i = 0; i < posArr.length; i++) {
    if ((headX === posArr[i][0]) && (headY === posArr[i][1])) {
      bites = true;
      break;
    }
  }
  return bites;
}

function gameOver() {
  clearTimingVars();
  alert("GAME OVER");
  location.reload();
}

function randomizeLocation() {
  foodX = Math.floor(Math.random() * 15);
  foodY = Math.floor(Math.random() * 10);
  let posArr = getPosArr();
  posArr.push([getXPos(getHead()), getYPos(getHead())]);
  for (i = 0; i < posArr.length; i++) {
    if ((foodX * 70 === posArr[i][0]) && (foodY * 70 === posArr[i][1])) {
      randomizeLocation();
    }
  }
}

function createFood() {
  randomizeLocation();
  getFood().style.left = foodX * 70 + "px";
  getFood().style.top = foodY * 70 + "px";
}

function bitesFood() {
  let food_x = parseInt(getFood().style.left.slice(0, getFood().style.left.length - 2));
  let food_y = parseInt(getFood().style.top.slice(0, getFood().style.top.length - 2));
  if ((food_x === getXPos(getHead())) && (food_y === getYPos(getHead()))) {
    createFood();
    attachNode();
    updateScore();
  }
}

function moveRight() {
  followPrevNode();
  xPos1 += 70;
  if (xPos1 > (getWidth(document.querySelector(".playing-area")) - 70)) {
    xPos1 = 0;
  }
  getHead().style.left = xPos1 + "px";
  getHead().setAttribute("data-object-direction", "right");
  bitesFood();
  if (bitesItself() === true) {
    gameOver();
  }
  rightTimingVar = setTimeout(moveRight, 500);
}

function moveLeft() {
  followPrevNode();
  xPos1 -= 70;
  if (xPos1 < 0) {
    xPos1 = getWidth(document.querySelector(".playing-area")) - 70;
  }
  getHead().style.left = xPos1 + "px";
  getHead().setAttribute("data-object-direction", "left");
  bitesFood();
  if (bitesItself() === true) {
    gameOver();
  }
  leftTimingVar = setTimeout(moveLeft, 500);
}

function moveUp() {
  followPrevNode();
  yPos1 -= 70;
  if (yPos1 < 0) {
    yPos1 = getHeight(document.querySelector(".playing-area")) - 70;
  }
  getHead().style.top = yPos1 + "px";
  getHead().setAttribute("data-object-direction", "up");
  bitesFood();
  if (bitesItself() === true) {
    gameOver();
  }
  upTimingVar = setTimeout(moveUp, 500);
}

function moveDown() {
  followPrevNode();
  yPos1 += 70;
  if (yPos1 > (getHeight(document.querySelector(".playing-area")) - 70)) {
    yPos1 = 0;
  }
  getHead().style.top = yPos1 + "px";
  getHead().setAttribute("data-object-direction", "down");
  bitesFood();
  if (bitesItself() === true) {
    gameOver();
  }
  downTimingVar = setTimeout(moveDown, 500);
}

function clearTimingVars() {
  window.clearTimeout(rightTimingVar);
  window.clearTimeout(leftTimingVar);
  window.clearTimeout(upTimingVar);
  window.clearTimeout(downTimingVar);
}
document.addEventListener("keydown", function(event) {
  if (event.key == "ArrowRight") {
    clearTimingVars();
    if (getHead().getAttribute("data-object-direction") != "left") {
      moveRight();
    } else {
      moveLeft();
    }
  }
  if (event.key == "ArrowLeft") {
    clearTimingVars();
    if (getHead().getAttribute("data-object-direction") != "right") {
      moveLeft();
    } else {
      moveRight();
    }
  }
  if (event.key == "ArrowUp") {
    clearTimingVars();
    if (getHead().getAttribute("data-object-direction") != "down") {
      moveUp();
    } else {
      moveDown();
    }
  }
  if (event.key == "ArrowDown") {
    clearTimingVars();
    if (getHead().getAttribute("data-object-direction") != "up") {
      moveDown();
    } else {
      moveUp();
    }
  }
  if (event.key == " ") {
    clearTimingVars(); //to stop the snake
  }
  if (event.key == "o") {
    attachNode();
  }
});
createFood();
