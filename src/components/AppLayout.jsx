"use client";
import React from "react";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import {usePathname} from "next/navigation";
import Login from "./login/Login";

const AppLayout = ({children}) => {
  const pathname = usePathname();
  if (pathname === "/login") {
    return (
      <div className="global">
        {children}
      </div> 
    )
  } else {
    return (
      <div className="global">
        <Sidebar />
        <main className="global__main">
          <Header />
          {children}
        </main>
      </div>
    );
  }
};

export default AppLayout;
