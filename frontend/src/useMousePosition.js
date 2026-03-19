import { useState, useEffect } from "react";

export default function useMousePosition() {
  const [pos, setPos] = useState({ x: -1, y: -1 });

  useEffect(() => {
    function handleMove(e) {
      setPos({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return pos;
}
