"use client";
import React from "react";
import "./admins.modules.scss";
import Pagination from "../pagination/Pagination";

const Admins = () => {
  return (
    <div className="admins">
      <div className="admins__top">
        <h2 className="admins__title">Admins</h2>
        <p className="admins__sub-tit"></p>
      </div>
      <div className="admins__me">
        <div className="admins__me-box">
          <p className="admins__me-title">login</p>
          <p className="admins__me-sub-tit">fullName</p>
        </div>
        <button className="admins__me-change">
          <span className="admins__me-span">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path>
            </svg>
          </span>
          Change own password
        </button>
      </div>
      <Pagination/>
    </div>
  );
};

export default Admins;
