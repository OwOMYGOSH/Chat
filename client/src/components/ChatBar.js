import React from "react";

const ChatBar = (props) => {
  const userList = props.connectedUsers;

  console.log("In sidebar userlist:", userList);

  let selectedUser = "";

  const userName_from_click = (e) => {
    selectedUser = e.target.innerText;
    let selectedUserDetails = userList.find(
      (user) => user.username === selectedUser
    );

    console.log("In sidebar the user details:", selectedUserDetails);
    props.selectUser(selectedUserDetails);
  };

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
          {/* <p className="chat__users__status">
            {user.connected ? "online" : "offline"}
          </p> */}
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
