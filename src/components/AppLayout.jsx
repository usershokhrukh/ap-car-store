"use client";
import React, {Suspense, useContext, useEffect} from "react";
import Sidebar from "./sidebar/Sidebar";
import {usePathname} from "next/navigation";
import { GeneralModal } from "@/context/GeneralModal";
import GeneralModalUI from "./modal/GeneralModalUI";
const AppLayout = ({children}) => {
  const pathname = usePathname();
  const {closeModal, setCloseModal} = useContext(GeneralModal);
  useEffect(() => {
    const handleKey = (e) => {
      if(e.key == "Escape") {
        setCloseModal(false)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => {
      window.addEventListener("keydown", handleKey)
    } 
  }, []) 
  return (
    <div className="global">
      {pathname === "/login" ? (
        <>{children}</>
      ) : (
        <>
          <Sidebar />
          <main className="global__main">
            <Suspense>{children}</Suspense>
          </main>
        </>
      )}

      {
        closeModal ? <GeneralModalUI/> : null
      }
      
    </div>
  );
};

export default AppLayout;
