"use client";

import Image from "next/image";
import backImg from "../../public/images/image.png";

export default function ProtectedImage() {
  return (
    <div
      className="global__back-img"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onSelect={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        KhtmlUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        pointerEvents: "none", 
      }}
    >
      <Image
        src={backImg}
        alt="Dashboard Background"
        unoptimized
        priority
        quality={100}
        fill
        draggable={false}
      />
    </div>
  );
}
