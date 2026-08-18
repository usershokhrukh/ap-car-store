"use client";

import Image from "next/image";
import backImg from "../../public/images/image.png";
import backImgLight from "../../public/images/img-light.jpg";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

export default function ProtectedImage() {
  const {theme, setTheme} = useTheme();
  useEffect(() => {
    console.log(theme);
  }, [theme]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`global__back-img ${theme == "dark" ? "" : "global__back-img-light"}`}
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
        src={theme == "dark" ? backImg : backImgLight}
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
