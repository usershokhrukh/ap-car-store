"use client";

import React, {useEffect, useState} from "react";
import "./sidebar.modules.scss";
import Link from "next/link";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useNotify} from "@/hooks/useNotify";
const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1200);
  const {notice} = useNotify();
  const route = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", () =>
        setWindowWidth(window.innerWidth),
      );
      return () =>
        window.removeEventListener("resize", () =>
          setWindowWidth(window.innerWidth),
        );
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/auth/logout");
      route.refresh();
    } catch (error) {
      notice({
        text: "Something went wrong!",
        time: 3000,
        status: "error",
      });
    }
  };
  return (
    <div
      className={`sidebar ${open ? "" : "sidebar__close"} ${windowWidth >= 1000 ? "" : "sidebar__close"}`}
    >
      {windowWidth >= 1000 ? (
        <div
          className="sidebar__top"
          style={{justifyContent: `${open ? "space-between" : "center"}`}}
        >
          {open ? (
            <h2 className="sidebar__title">
              <span className="sidebar__tit-span">CAR</span>SERVICE
            </h2>
          ) : null}

          <span
            onClick={() => setOpen(!open)}
            className="sidebar__li-span sidebar__li-span-side"
          >
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 5H13V19H5V5ZM19 19H15V5H19V19ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3H4ZM7 12L11 8.5V15.5L7 12Z"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 5H13V19H5V5ZM19 19H15V5H19V19ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3H4ZM11 12L7 8.5V15.5L11 12Z"></path>
              </svg>
            )}
          </span>
        </div>
      ) : null}

      <div className="sidebar__bottom">
        <ul className="sidebar__ul">
          <Link className="sidebar__link" href={"/"}>
            <li className="sidebar__list">
              <span className="sidebar__li-span">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 10C3 10.5523 3.44772 11 4 11L12 11C12.5523 11 13 10.5523 13 10V4C13 3.44772 12.5523 3 12 3H4C3.44772 3 3 3.44772 3 4V10ZM11 20C11 20.5523 11.4477 21 12 21H20C20.5523 21 21 20.5523 21 20V14C21 13.4477 20.5523 13 20 13H12C11.4477 13 11 13.4477 11 14V20ZM13 15H19V19H13V15ZM3 20C3 20.5523 3.44772 21 4 21H8C8.55229 21 9 20.5523 9 20V14C9 13.4477 8.55229 13 8 13H4C3.44772 13 3 13.4477 3 14V20ZM5 19V15H7V19H5ZM5 9V5L11 5L11 9L5 9ZM20 11C20.5523 11 21 10.5523 21 10V4C21 3.44772 20.5523 3 20 3H16C15.4477 3 15 3.44772 15 4V10C15 10.5523 15.4477 11 16 11H20ZM19 9H17V5H19V9Z"></path>
                </svg>
              </span>
              <p className="sidebar__li-txt">Dashboard</p>
            </li>
          </Link>
          <Link className="sidebar__link" href={"/products"}>
            <li className="sidebar__list">
              <span className="sidebar__li-span">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.5 7.65311V16.3469L12 20.689L19.5 16.3469V7.65311L12 3.311L4.5 7.65311ZM12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM6.49896 9.97065L11 12.5765V17.625H13V12.5765L17.501 9.97066L16.499 8.2398L12 10.8445L7.50104 8.2398L6.49896 9.97065Z"></path>
                </svg>
              </span>
              <p className="sidebar__li-txt">Products</p>
            </li>
          </Link>
          <Link className="sidebar__link" href={"/categories"}>
            <li className="sidebar__list">
              <span className="sidebar__li-span">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0.5C18.3513 0.5 23.5 5.64873 23.5 12C23.5 12.3369 23.4855 12.6704 23.4571 13H21.9506C21.4489 18.0533 17.1853 22 12 22C6.47715 22 2 17.5228 2 12C2 6.81465 5.94668 2.5511 11 2.04938V0.542876C11.3296 0.514488 11.6631 0.5 12 0.5ZM11 4.06189C7.05369 4.55399 4 7.92038 4 12C4 16.4183 7.58172 20 12 20C16.0796 20 19.446 16.9463 19.9381 13H11V4.06189ZM13 2.552V11H21.448C20.9827 6.55197 17.448 3.01732 13 2.552Z"></path>
                </svg>
              </span>
              <p className="sidebar__li-txt">Categories</p>
            </li>
          </Link>
          <Link className="sidebar__link" href={"/chats"}>
            <li className="sidebar__list">
              <span className="sidebar__li-span">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2 8.99374C2 5.68349 4.67654 3 8.00066 3H15.9993C19.3134 3 22 5.69478 22 8.99374V21H8.00066C4.68659 21 2 18.3052 2 15.0063V8.99374ZM20 19V8.99374C20 6.79539 18.2049 5 15.9993 5H8.00066C5.78458 5 4 6.78458 4 8.99374V15.0063C4 17.2046 5.79512 19 8.00066 19H20ZM14 11H16V13H14V11ZM8 11H10V13H8V11Z"></path>
                </svg>
              </span>
              <p className="sidebar__li-txt">Chats</p>
            </li>
          </Link>
        </ul>
        <ul className="sidebar__ul">
          <Link className="sidebar__link" href={"/settings"}>
            <li className="sidebar__list">
              <span className="sidebar__li-span">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM12 3.311L4.5 7.65311V16.3469L12 20.689L19.5 16.3469V7.65311L12 3.311ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"></path>
                </svg>
              </span>
              <p className="sidebar__li-txt">Settings</p>
            </li>
          </Link>
          <span onClick={handleLogout} className="sidebar__link">
            <li className="sidebar__list sidebar__list-logout">
              <span className="sidebar__li-span">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4 18H6V20H18V4H6V6H4V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V18ZM6 11H13V13H6V16L1 12L6 8V11Z"></path>
                </svg>
              </span>
              <p className="sidebar__li-txt">Logout</p>
            </li>
          </span>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
