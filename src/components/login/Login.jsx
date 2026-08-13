"use client";
import React, {useEffect, useRef, useState} from "react";
import "./login.modules.scss";
import {useNotify} from "@/hooks/useNotify";
import axios from "axios";
import {PostLogin} from "@/hooks/login/PostLogin";
import {usePathname, useRouter} from "next/navigation";

const Login = () => {
  const route = useRouter();
  const [input, setInput] = useState({
    login: "",
    password: "",
  });
  const {notice} = useNotify();
  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
  const refUsername = useRef(null);
  const refPassword = useRef(null);
  const {mutate, data, error, isPending} = PostLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.password && !input.login)
      return notice({
        text: "Fill all inputs!",
        status: "error",
        time: 3000,
      });
    if (!input.password && input.login) {
      refPassword.current.focus();
      return notice({
        text: "Filling password is necessary!",
        status: "info",
        time: 3000,
      });
    }
    if (input.password && !input.login) {
      refUsername.current.focus();
      return notice({
        text: "Filling username is necessary!",
        status: "info",
        time: 3000,
      });
    }
    notice({text: "Pending...", status: "info", time: "infinite"});
    mutate(input);
  };

  useEffect(() => {
    if (error?.message) {
      notice({text: error?.message, time: 3000, status: "error"});
    }
  }, [error]);
  const timeoutSuccess = useRef(null);
  useEffect(() => {
    if (data && !error?.message && !isPending) {
      notice({
        text: data?.message || "Tizimga kirildi!",
        time: 3000,
        status: "success",
      });
      route.refresh();
      if (timeoutSuccess.current) clearTimeout(timeoutSuccess.current);
      timeoutSuccess.current = setTimeout(() => {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/login")) {
          notice({
            text: "Page loading...",
            time: "infinite",
            status: "info",
          });
        }
      }, 500);
    }
  }, [data]);

  const [passwordType, setPasswordType] = useState(false);
  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="login__form">
        <h1 className="login__title">Welcome Back!</h1>
        <div className="login__f-box">
          <label className="login__f-label" htmlFor="login">
            Username
          </label>
          <div className="login__f-box-bottom">
            <input
              ref={refUsername}
              onChange={handleChange}
              value={input.username}
              type="text"
              name="login"
              id="login"
              className="login__f-input"
            />
          </div>
        </div>
        <div className="login__f-box">
          <label className="login__f-label" htmlFor="password">
            Password
          </label>
          <div className="login__f-box-bottom">
            <input
              ref={refPassword}
              value={input.password}
              onChange={handleChange}
              type={passwordType ? 'text' : 'password'}
              name="password"
              id="password"
              className="login__f-input"
            />
            <span onClick={() => setPasswordType(!passwordType)} className="login__f-svg">
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
        <button disabled={isPending} type="submit" className="login__f-submit">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default Login;
