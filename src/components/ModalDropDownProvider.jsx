"use client";
import {ModalDropDown} from "@/context/ModalDropDown";
import "./modal/modal.modules.scss";
import React, {useState} from "react";

const ModalDropDownProvider = ({children}) => {
  const [closeDrop, setCloseDrop] = useState(false);
  const [compDrop, setCompDrop] = useState(null);
  return (
    <ModalDropDown.Provider
      value={{closeDrop, setCloseDrop, compDrop, setCompDrop}}
    >
      <>
        {closeDrop ? (
          <div className="modal__drop-wr">
            <div className="modal__drop-center">
              <div className="modal__drop-center-box">
                <span
                  onClick={() => {
                    setCloseDrop(false);
                  }}
                  className="modal__cn-span"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
                  </svg>
                </span>
              </div>

              <div className="modal__drop-content">{compDrop}</div>
              
            </div>
          </div>
        ) : null}
      </>

      {children}
    </ModalDropDown.Provider>
  );
};

export default ModalDropDownProvider;
