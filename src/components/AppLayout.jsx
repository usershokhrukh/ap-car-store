"use client";
import React, {Suspense} from "react";
import Sidebar from "./sidebar/Sidebar";
import {usePathname} from "next/navigation";
const AppLayout = ({children}) => {
  const pathname = usePathname();
  if (pathname === "/login") {
    return <div className="global">{children}</div>;
  } else {
    return (
      <div className="global">
        <Sidebar />
        <main className="global__main">
          <Suspense>{children}</Suspense>
        </main>
      </div>
    );
  }
};

export default AppLayout;
