const app = require("express")();
const http = require("http").Server(app);
const mysql = require("mysql");
const moment = require("moment");
const PORT = 4000;

const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_back",
});

con.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log("Database connected");
});

io.use((socket, next) => {
  const username = socket.handshake.auth.fetched_userName;
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  const users = [];

  // 每有一個人連進來(新增一個socket)，就會更新 users 
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
      key: id,
    });
  }

  socket.broadcast.emit("user connect", {
    userID: socket.id,
    username: socket.username,
    key: socket.id,
    self: false,
    // connected: false,
  });

  socket.emit("users", users);

  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      time: moment().format("h:mm a"),
      from: socket.id,
    });

    con.query(
      `Insert into chat (id, from_id, to_id, body, created_at, updated_at)
        values (NULL, '${socket.id}', '${to}', '${content}', '${moment().format("YYYY-MM-DD HH:mm:ss")}', NULL)`,
      function (err, res) {
        if (err) {
          throw err;
        }
        console.log("Message send to db");
      });
  });

  
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
