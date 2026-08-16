import React, {useContext, useEffect} from "react";
import "./modal.modules.scss";
import {GeneralModal} from "@/context/GeneralModal";

const GeneralModalUI = () => {
  const {compModal, setCloseModal, closeSpan, setCloseSpan} = useContext(GeneralModal);
  useEffect(() => {
    setCloseSpan(true)
  }, [])
  return (
    <div className="modal">
      <div className="modal__center">
        {closeSpan ? (
          <span onClick={() => setCloseModal(false)} className="modal__cn-span">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
            </svg>
          </span>
        ) : null}
        {compModal}
      </div>
    </div>
  );
};

export default GeneralModalUI;
