import React from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

const ChatBody = (props) => {
  const navigate = useNavigate();

  const handleLeaveChat = () => {
    console.log(socket.username);
    socket.disconnect();
    navigate("/");
    window.location.reload();
  };

  // receive private message from server
  socket.on("private message", ({ content, time, from }) => {

    let newMessages = {
      fromUser: from,
      content,
      time,
      fromSelf: false,
    };

    props.setMessages([...props.messages, newMessages]);
  });

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
