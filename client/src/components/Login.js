import React from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fetched_userName = e.target[0].value;
    props.submit(fetched_userName);
    navigate("/chat");
  };

  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">Sign in to Open Chat</h2>
      <label htmlFor="username">Username</label>
      <input type="text" className="username__input" placeholder="Enter username"/>
      <button className="home__cta">SIGN IN</button>
    </form>
  );
};

export default Login;
