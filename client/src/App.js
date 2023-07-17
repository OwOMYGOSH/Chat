import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Login from "./components/Login";
import ChatPage from "./components/ChatPage";
import socket from "./socket";

function App() {
  const [userName, setUserName] = useState("");
  const [usersList, addUsers] = useState([]);

  // When the user is added
  const getUsername = (fetched_userName) => {
    setUserName(fetched_userName);
    console.log("App:" + fetched_userName);
    socket.auth = { fetched_userName };
    socket.connect();
  };

  socket.on("users", (users) => {
    console.log(users);
    users.forEach((user) => {
      user.self = user.userID === socket.id;
    });

    // put the current user first, and then sort by username
    users = users.sort((a, b) => {
      if (a.self) return -1;
      if (b.self) return 1;
      if (a.username < b.username) return -1;
      return a.username > b.username ? 1 : 0;
    });
    addUsers(users);
  });

  socket.on("user connected", (user) => {
    addUsers([...usersList, user]);
  });

//   socket.on("user disconnected", (name) => {
//     console.log("App: ", name);
//     for (let i = 0; i < usersList.length; i++) {
//         console.log("in user disconnected: " + i);
//       if (usersList[i].username === name) {
//         usersList.splice(i, 1);
//       }
//     }
//     addUsers(usersList);
//     console.log("App: ", usersList);
//   });

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
