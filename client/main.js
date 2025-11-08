
const socket = io();
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 60;


let drawing = false;
let brushSize = document.getElementById("brushSize").value;
let colorPicker = document.getElementById("colorPicker");
let brushColor = colorPicker.value;


let currentStroke = [];
let allStrokes = {}; 


const userListEl = document.getElementById("userList");


colorPicker.addEventListener("input", e => {
  brushColor = e.target.value;
});

document.getElementById("brushSize").addEventListener("input", e => {
  brushSize = e.target.value;
});



document.getElementById("clearBtn").addEventListener("click", () => {
  socket.emit("clearCanvas");
});


document.getElementById("clearBtn").insertAdjacentHTML("afterend", '<button id="undoBtn">Undo</button>');
document.getElementById("undoBtn").addEventListener("click", () => {
  socket.emit("undo");
});


canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("mousemove", draw);

function startDrawing(e) {
  drawing = true;
  currentStroke = [];
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY - 60);
}

function stopDrawing() {
  if (!drawing) return;
  drawing = false;
  ctx.beginPath();

  
  if (currentStroke.length > 0) {
    socket.emit("strokeComplete", {
      points: currentStroke,
      color: brushColor,
      size: brushSize
    });
  }
  currentStroke = [];
}

function draw(e) {
  if (!drawing) return;

  const x = e.clientX;
  const y = e.clientY - 60;

  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = brushColor;
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);

  currentStroke.push({ x, y });

 
  socket.emit("draw", { x, y, color: brushColor, size: brushSize });
  socket.emit("cursor", { x, y, color: brushColor });
}


socket.on("draw", data => {
  ctx.lineWidth = data.size;
  ctx.lineCap = "round";
  ctx.strokeStyle = data.color;
  ctx.lineTo(data.x, data.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(data.x, data.y);
});


socket.on("strokeComplete", stroke => {
  allStrokes[stroke.id] = stroke;
  redrawCanvas();
});


socket.on("undo", removedId => {
  if (removedId && allStrokes[removedId]) {
    delete allStrokes[removedId];
  }
  redrawCanvas();
});


socket.on("clearCanvas", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  allStrokes = {};
});


function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Object.values(allStrokes).forEach(stroke => {
    ctx.beginPath();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
    stroke.points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
  });
}


const cursorLayer = document.createElement("div");
cursorLayer.style.position = "absolute";
cursorLayer.style.top = "60px";
cursorLayer.style.left = "0";
cursorLayer.style.width = "100%";
cursorLayer.style.height = "calc(100vh - 60px)";
cursorLayer.style.pointerEvents = "none";
cursorLayer.style.zIndex = "10";
document.body.appendChild(cursorLayer);


const remoteCursors = {}; // store other users' cursors

socket.on("cursor", data => {
  let cursor = remoteCursors[data.id];
  if (!cursor) {
    cursor = document.createElement("div");
    cursor.style.position = "absolute";
    cursor.style.width = "10px";
    cursor.style.height = "10px";
    cursor.style.borderRadius = "50%";
    cursor.style.background = data.color;
    cursor.style.pointerEvents = "none";
    cursor.style.transform = "translate(-50%, -50%)";
    cursorLayer.appendChild(cursor);
    remoteCursors[data.id] = cursor;
  }
  cursor.style.left = data.x + "px";
  cursor.style.top = data.y + "px";
});

socket.on("userLeft", id => {
  if (remoteCursors[id]) {
    remoteCursors[id].remove();
    delete remoteCursors[id];
  }
});


socket.on("updateUserList", users => {
  userListEl.innerHTML = "";
  Object.entries(users).forEach(([id, color]) => {
    const li = document.createElement("li");
    li.className = "user-item";
    li.innerHTML = `<span class="color-dot" style="background:${color}"></span> ${id.substring(0, 6)}`;
    userListEl.appendChild(li);
  });
});
