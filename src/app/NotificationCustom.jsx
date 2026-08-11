"use client";

import React, {useEffect, useRef, useState} from "react";
import {Providers} from "./provides";
import {ErrorContext} from "@/context/ErrorContext";
const NotificationCustom = ({children}) => {
  const [error, setError] = useState({
    text: "",
    timeout: 5000,
    close: true,
  });

  const [close, setClose] = useState(null);

  const [errorClose, setErrorClose] = useState(false);
  const [noticeSVG, setNoticeSVG] = useState(
    <svg
      className="error__span-error"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"></path>
    </svg>,
  );
  const errorTimerRef = useRef(null);

  useEffect(() => {
    if (error.text?.trim().length) {
      setErrorClose(true);
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      if (error?.timeout !== "infinite") {
        errorTimerRef.current = setTimeout(() => {
          setErrorClose(null);
        }, error?.timeout);
      }
    } else if (errorClose != false) {
      setErrorClose(null);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);
  const handleNotice = () => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
    setErrorClose(null);
  };

  useEffect(() => {
    if(close?.status === 'true') {
      setErrorClose(null)
    }
    setClose(null)
  }, [close])
  return (
      <ErrorContext.Provider value={[setError, setNoticeSVG, setClose]}>
        <Providers>
          <span
            className={`error__span-wrap ${errorClose ? "animate-notify" : errorClose == false ? "error__none" : "animate-notify-close"}`}
          >
            <span className="error__span">
              {noticeSVG}
              <span className="error__span-text">{error.text}</span>

              {error?.close ? (
                <span
                  onClick={handleNotice}
                  className={`error__close ${errorClose ? "animate-close" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z"></path>
                  </svg>
                </span>
              ) : null}
            </span>
          </span>
          {children}
        </Providers>
      </ErrorContext.Provider>
  );
};

export default NotificationCustom;
