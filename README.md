a) Real-Time Collaborative Drawing Canvas
A multi-user, real-time drawing application built with Vanilla JS + HTML5 Canvas on the frontend and Node.js + WebSockets (Socket.IO) on the backend.
Multiple users can draw together, see each other’s cursors, and undo/clear actions globally — all in real time.

b) Live Demo

 https://collaborative-canvas-hssq.onrender.com

Open this link in two browsers or devices to test live collaboration instantly!

c) Video Demonstration

Watch the the quick demo video here:  
[Demo Video](https://drive.google.com/file/d/1FYnOHNJz-NQ21WscEBC9yCSN0mTZTFs5/view?usp=sharing)

d) Project Structure
collaborative-canvas/

├── client/

│   ├── index.html        # UI & layout

│   ├── style.css         # Styling & layout

│   └── main.js           # Canvas + WebSocket logic

├── server/

│   └── server.js         # Express + Socket.IO backend

├── package.json          # Node dependencies & scripts

├── README.md             # Project overview & setup guide

└── ARCHITECTURE.md       # Design & event flow documentation

e) Installation & Setup (Run Locally)
1) Clone the repository
git clone https://github.com/<your-username>/collaborative-canvas.git
cd collaborative-canvas

2) Install dependencies
npm install

3) Run the server
npm start

4) Open your browser and visit:
http://localhost:3000

f) Features

Real-time collaborative drawing

Live cursor tracking for all users

Global Undo (works across all clients)

Conflict-safe Clear Canvas

User color assignment for identification

Online user list (real-time updates)

Works on all modern browsers

Deployed and hosted on Render (free Node hosting)

 g) Tech Stack
 
 Layer -	          Technology

Frontend -       HTML5, CSS3, Vanilla JavaScript

Backend -         Node.js, Express.js

Communication -	   WebSockets (Socket.IO)

Hosting -	         Render.com

h) Testing Instructions (Multi-User Demo)

Open the Render live link in two or more browsers/tabs.

Start drawing on one canvas → strokes appear instantly on all others.

Try Undo → last stroke disappears globally.

Click Clear → all canvases reset together.

Watch as user cursors and user list update in real-time.

i) Conflict Handling

All events (draw, undo, clear) are handled centrally on the server.

The server maintains a global strokeHistory array to ensure canvas consistency.

Clients re-render the canvas whenever the global state changes.

j) Known Limitations

Canvas state resets when the server restarts (no database persistence).

Undo works globally, not per-user yet.

The Render free tier sleeps after 15 minutes of inactivity (auto wakes on visit).

k) Time Spent

Total: ~8–10 hours

l) Breakdown:

3 hrs – Canvas & drawing logic

2 hrs – WebSocket setup & event testing

2 hrs – Undo/Clear system

1 hr – User cursors & sidebar

1–2 hrs – Docs + Deployment

m) Author

Bhps Madhav

B.Tech Final Year 

bhpsmadhav17@gmail.com

 n) License
 This project is licensed under the MIT License — free to use, modify, and distribute.
