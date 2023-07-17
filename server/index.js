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

  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
      key: id,
    });
  }

  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
    key: socket.id,
    self: false,
  });

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
  
  socket.on("disconnect", () => {
    console.log(users);
    console.log("disconnect: " + socket.username);
    //socket.broadcast.emit("user disconnected", socket.username)
    for (let i = 0; i < users.length; i++) {
      console.log("userID: " + users[i].userID);
      console.log("socket id: " + socket.id);
      if (users[i].userID === socket.id) {
        console.log("before: ", users);
        users.splice(i, 1);
        break;
      }
    }
    console.log("after: " + users);
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
