var color = document.querySelector("#color");
var eraser = document.querySelector("#eraser");
var dec = document.querySelector("#decrease");
var inc = document.querySelector("#increase");
var size = document.querySelector("#size");
var clear = document.querySelector("#clear");
var save = document.querySelector("#save");
var inputSize = document.querySelector("#inputSize");
var canvas = document.querySelector("#canvas");
//context
var ctx = canvas.getContext("2d");
var paintColor = "#000";
var paintSize = 5;
size.value = paintSize;
var currentPos = {
  x: 0,
  y: 0,
};
var currentPosAfter = {
  x: 0,
  y: 0,
};
var isDrawing = false;

ctx.beginPath();
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#fff";
ctx.fill();

canvas.addEventListener("mousedown", (e) => {
  currentPos = {
    x: e.offsetX,
    y: e.offsetY,
  };
  isDrawing = true;
});
canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    currentPosAfter = {
      x: e.offsetX,
      y: e.offsetY,
    };

    ctx.beginPath();
    ctx.arc(currentPos.x, currentPos.y, paintSize, 0, 2 * Math.PI);
    ctx.fillStyle = paintColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(currentPos.x, currentPos.y);
    ctx.lineTo(currentPosAfter.x, currentPosAfter.y);
    ctx.strokeStyle = paintColor;
    ctx.lineWidth = paintSize * 2;
    ctx.stroke();

    currentPos.x = currentPosAfter.x;
    currentPos.y = currentPosAfter.y;
  }
});
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

color.addEventListener("change", (e) => {
  paintColor = e.target.value;
});
inc.addEventListener("click", () => {
  paintSize++;
  size.value = paintSize;
});
dec.addEventListener("click", () => {
  paintSize--;
  size.value = paintSize;
});
size.addEventListener("change", (e) => {
  paintSize = e.target.value;
  size.value = paintSize;
});
clear.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

save.addEventListener("click", () => {
  var output = canvas.toDataURL("image/png"); // BASE64
  save.setAttribute("href", output);
});
eraser.addEventListener("click", (e) => {
  paintColor = "#fff";
});
