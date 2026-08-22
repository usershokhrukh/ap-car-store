// context/TooltipProvider.jsx
"use client";
import { TooltipContext } from "@/context/TooltipContext";
import React, { useState } from "react";

const TooltipProvider = ({ children }) => {
  const [text, setText] = useState("");
  const [openTooltip, setOpenTooltip] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  return (
    <TooltipContext.Provider value={{ setText, setCoords, setOpenTooltip }}>
      {children} 
      {openTooltip && (
        <span
          className="global-tooltip"
          style={{
            position: "fixed",
            pointerEvents: "none",
            zIndex: 9999, 
            left: `${coords?.x || 0}px`,
            top: `${coords?.y || 0}px`,
          }}
        >
          {text}
        </span>
      )}
    </TooltipContext.Provider>
  );
};

export default TooltipProvider;
