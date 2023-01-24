const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const cors = require('cors');
app.use(cors());
app.use('/api', createProxyMiddleware({ target: 'http://mobilecdn.kugou.com/', changeOrigin: true }));
app.use('/yy', createProxyMiddleware({ target: 'https://wwwapi.kugou.com/', changeOrigin: true }));
app.use('/stdmusic', createProxyMiddleware({ target: 'https://imgessl.kugou.com/', changeOrigin: true }));
// app.all('*', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE,OPTIONS');
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', ['mytoken','Content-Type']);
//   next();
// });
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// app.get('/', (req, res) => {
// 	  res.sendFile(__dirname + '/dist/index.html');
// });

const history = require('connect-history-api-fallback');
app.use(history())
app.use(express.static(path.join(__dirname, 'dist')));


io.on('connection', (socket) => {
	  console.log('a user connected: '+socket.id);
    socket.on("play", (arg) => {
      console.log("play:"); // hash
      io.emit("play",arg);
    });
    socket.on("pause", (arg) => {
      console.log("pause:"); // hash
      console.log(arg);
      io.emit("pause",arg);
    });
});

server.listen(3000, () => {
	  console.log('listening on *:3000');
});
/*
let currentAudio = null;

io.on('connection', (socket) => {
  // ...

  // Handle client messages
  socket.on('message', (message) => {
    // Update the current audio
    currentAudio = message;

    // Broadcast the updated audio to all clients
    socket.broadcast.emit('audio', currentAudio);
  });

  // ...
});

*/

