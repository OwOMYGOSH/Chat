import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Login from "./components/Login";
import ChatPage from "./components/ChatPage";
import socket from "./socket";

function App() {
  const [userName, setUserName] = useState("");
  const [usersList, addUsers] = useState([]);

  // When the user is login fetched_userName from Login.js with submit
  const getUsername = (fetched_userName) => {
    setUserName(fetched_userName);
    socket.auth = { fetched_userName };
    socket.connect(); // 丟回 server line 30
  };

  socket.on("other user connect", (user) => {
    addUsers([...usersList, user]);
  });

  // 更新 user.self 狀態
  socket.on("users", (users) => {
    users.forEach((user) => {
      // 透過該網頁的 socket.id 與 userID 判斷是否為本人
      user.self = user.userID === socket.id;
    });

    addUsers(users);
  });

  return (
    <BrowserRouter>
      <div>
        <Routes>
          {!userName ? (
            <Route
              path="/"
              element={<Login submit={(event) => getUsername(event)} />}
            ></Route>
          ) : (
            <Route
              path="/chat"
              element={<ChatPage user={userName} connectedUsers={usersList} />}
            ></Route>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
