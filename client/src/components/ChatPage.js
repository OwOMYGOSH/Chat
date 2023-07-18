import React, { useEffect, useState, useRef } from "react";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

const ChatPage = (props) => {
  const [selectedUser, setSelectedUser] = useState({});
  const [userSelected, setUserSelected] = useState(false); // So that any chat window is not rendered when app is loaded
  const [messages, setMessages] = useState([]);
  const lastMessageRef = useRef(null);

  const getSelectedUser = (user) => {
    setSelectedUser(user);
    // 有人被選取才會有聊天室跑出來
    setUserSelected(true);
  };

  // 👇️ scroll to bottom every time messages change
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat">
      <ChatBar 
        connectedUsers={props.connectedUsers}
        selectUser={getSelectedUser}
      />
      {userSelected ? (
        <div className="chat__main">
        <ChatBody 
          selectedUser={selectedUser}
          connectedUsers={props.connectedUsers}
          messages = {messages}
          setMessages = {setMessages}
          lastMessageRef={lastMessageRef}
        />
        <ChatFooter 
          selectedUser={selectedUser}
          connectedUsers={props.connectedUsers}
          messages = {messages}
          setMessages = {setMessages}
        />
      </div>
      ) : (
        <div className="chat__main">Click user to start messaging</div>
      )}
    </div>
  );
};

export default ChatPage;
