import React from "react";
import socket from "../socket";

const moment = require("moment");
const ChatFooter = (props) => {
  let messageContent = "";
  let ref; //Reference to the input field so that it gets cleared every time we submit

  const getContent = (e) => {
    messageContent = e.target.value;
    ref = e;
  };

  const onMessage = (e, content) => {
    e.preventDefault();
    ref.target.value = "";
    if (props.selectedUser) {
      socket.emit("private message", {
        content,
        to: props.selectedUser.userID,
      });
      // 訊息加進自己的聊天紀錄
    }
    props.setMessages((messages) => [
      ...messages,
      {
        toUser: props.selectedUser.username,
        content,
        time: moment().format("h:mm a"),
        fromSelf: true,
      },
    ]);
  };

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={(e) => onMessage(e, messageContent)}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          onChange={(e) => getContent(e)}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
