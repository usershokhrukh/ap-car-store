"use client";
import React, { useRef, useState } from "react";
import "./login.modules.scss"

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }
  const refUsername = useRef(null);
  const refPassword = useRef(null);

  const handleSubmit =(e) => {
    e.preventDefault();
    if(!input.password && !input.username) return
    if(!input.password && input.username) return refPassword.current.focus();
    if(input.password && !input.username) return refUsername.current.focus();
    console.log(input);
  } 
  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="login__form">
        <h1 className="login__title">Welcome Back!</h1>
        <div className="login__f-box">
          <label className="login__f-label" htmlFor="username">Username</label>
          <div  className="login__f-box-bottom">
            <input
            ref={refUsername}
            onChange={handleChange}
            value={input.username}
              type="text"
              name="username"
              id="username"
              className="login__f-input"
            />
            {/* <span className="login__f-svg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 6C12.8284 6 13.5 5.32843 13.5 4.5C13.5 3.67157 12.8284 3 12 3C11.1716 3 10.5 3.67157 10.5 4.5C10.5 5.32843 11.1716 6 12 6ZM9 10H11V18H9V20H15V18H13V8H9V10Z"></path>
              </svg>
            </span> */}
          </div>
        </div>
        <div className="login__f-box">
          <label className="login__f-label" htmlFor="password">Password</label>
          <div className="login__f-box-bottom">
            <input
            ref={refPassword}
            value={input.password}
            onChange={handleChange}
              type="text"
              name="password"
              id="password"
              className="login__f-input"
            />
            <span className="login__f-svg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path>
              </svg>
            </span>
          </div>
        </div>
        <button type="submit" className="login__f-submit">Sign in</button>
      </form>
    </div>
  );
};

export default Login;
