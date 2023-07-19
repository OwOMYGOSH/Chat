import React from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

const ChatBody = (props) => {
  const navigate = useNavigate();

  const handleLeaveChat = () => {
    socket.disconnect();
    navigate("/");
    window.location.reload();
  };

  // receive private message from server
  socket.on("private message", ({ content, time, from }) => {
    for (let i = 0; i < props.connectedUsers.length; i++) {
      const user = props.connectedUsers[i];
      if (user.username === from) {
        let newMessages = {
          fromUser: from,
          content,
          time,
          fromSelf: false,
        };

        props.setMessages([...props.messages, newMessages]);

        if (user.username !== props.selectedUser.username) {
          user.hasNewMessages = true;
        } else {
            user.hasNewMessages = false; 
        }
        break;
      }
    }
  });

  const showMessages = props.messages.map((message) => {
    if (props.userSelected) {
      if (message.fromSelf && message.toUser === props.selectedUser.username)
        return (
          <>
            <div className="message__sender" ref={props.lastMessageRef}>
              <p>{message.time}</p>
              <p>{message.content}</p>
            </div>
          </>
        );
      else if (!message.fromSelf && message.fromUser === props.selectedUser.username)
        return (
          <>
            <div className="message__recipient" ref={props.lastMessageRef}>
              <p>{message.time}</p>
              <p>{message.content}</p>
            </div>
          </>
        );
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
        <div className="message__chats">{showMessages}</div>
      </div>
    </>
  );
};

export default ChatBody;
