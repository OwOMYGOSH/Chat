import React from "react";

const ChatBar = (props) => {
  const userList = props.connectedUsers;
  let selectedUser = "";

  const userName_from_click = (e) => {
    selectedUser = e.target.innerText;
    // 取得被選取使用者詳細訊息
    let selectedUserDetails = userList.find(
      (user) => user.username === selectedUser
    );

    props.selectUser(selectedUserDetails);
  };

  // 秀出其他連線的使用者
  let showUsers = userList.map((user) => {
    if (!user.self) {
      return (
        <>
          <div
            key={user.key}
            className="chat__users"
            onClick={(e) => userName_from_click(e)}
          >
            {user.username}
          </div>
        </>
      );
    }
  });

  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>

      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div>{showUsers}</div>
      </div>
    </div>
  );
};

export default ChatBar;
