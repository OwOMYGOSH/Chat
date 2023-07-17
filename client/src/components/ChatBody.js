import React from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

const ChatBody = (props) => {
  const navigate = useNavigate();

//   let selectedUser = {
//     ...props.selectedUser,
//     messages: [],
//   };

  const handleLeaveChat = () => {
    console.log(socket.username);
    socket.disconnect();
    navigate("/");
    window.location.reload();
  };

  const showMessages = props.messages.map((message) => {
    if (
      message.fromSelf === true &&
      message.toUser === props.selectedUser.username
    )
      return (
        <>
          
          <div className="message__sender" ref={props.lastMessageRef}>
            <p>{message.time}</p>
            <p>{message.content}</p>
          </div>
        </>
      );
    if (
      message.fromSelf === false &&
      message.fromUser === props.selectedUser.username
    )
      return (
        <>
          
          <div className="message__recipient" ref={props.lastMessageRef}>
            <p>{message.time}</p>
            <p>{message.content}</p>
          </div>
        </>
      );
  });

  // receive private message from server
  socket.on("private message", ({ content, time, from }) => {
    let newMessages = {};
    for (let i = 0; i < props.connectedUsers.length; i++) {
      const user = props.connectedUsers[i];
      if (user.userID === from) {
        newMessages = {
          fromUser: props.connectedUsers[i].username,
          content,
          time,
          fromSelf: false,
        };
        const messagesList = [...props.messages, newMessages];
        props.setMessages(messagesList);
      }
    }
  });

  return (
    <>
      <header className="chat__mainHeader">
        <p>{props.selectedUser.username}</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        <div className="message__chats">
            {showMessages}
        </div>
      </div>
    </>
  );
};

export default ChatBody;
