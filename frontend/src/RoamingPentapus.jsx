import { useRef, useEffect, useState } from "react";
import { PENTAPUS_ART } from "./asciiData";
import useMousePosition from "./useMousePosition";

const CELL_W = 10;
const CELL_H = 18;
const SPEED = 60; // px per second
const ATTRACTION_RADIUS = 200;
const DAMPING = 0.95;

function getWaypoints() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return [
    { x: w * 0.1, y: h * 0.1 },
    { x: w * 0.9, y: h * 0.1 },
    { x: w * 0.9, y: h * 0.9 },
    { x: w * 0.1, y: h * 0.9 },
  ];
}

export default function RoamingPentapus() {
  const mouse = useMousePosition();
  const posRef = useRef({ x: window.innerWidth * 0.1, y: window.innerHeight * 0.1 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const waypointIndexRef = useRef(0);
  const progressRef = useRef(0);
  const [renderPos, setRenderPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    function tick(time) {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const waypoints = getWaypoints();
      const idx = waypointIndexRef.current;
      const next = (idx + 1) % waypoints.length;
      const from = waypoints[idx];
      const to = waypoints[next];

      const segDx = to.x - from.x;
      const segDy = to.y - from.y;
      const segLen = Math.sqrt(segDx * segDx + segDy * segDy);
      if (segLen === 0) return;

      progressRef.current += (SPEED * dt) / segLen;
      if (progressRef.current >= 1) {
        progressRef.current = 0;
        waypointIndexRef.current = next;
      }

      const t = progressRef.current;
      const pathX = from.x + segDx * t;
      const pathY = from.y + segDy * t;

      // Mouse attraction
      if (mouse.x >= 0 && mouse.y >= 0) {
        const dx = mouse.x - pathX;
        const dy = mouse.y - pathY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < ATTRACTION_RADIUS) {
          const force = 1 - dist / ATTRACTION_RADIUS;
          offsetRef.current.x += dx * force * 0.02;
          offsetRef.current.y += dy * force * 0.02;
        }
      }

      // Dampen offset back to zero
      offsetRef.current.x *= DAMPING;
      offsetRef.current.y *= DAMPING;

      posRef.current.x = pathX + offsetRef.current.x;
      posRef.current.y = pathY + offsetRef.current.y;

      setRenderPos({ x: posRef.current.x, y: posRef.current.y });
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouse]);

  const rows = PENTAPUS_ART.length;
  const cols = Math.max(...PENTAPUS_ART.map((l) => l.length));
  const artW = cols * CELL_W;
  const artH = rows * CELL_H;

  const chars = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < PENTAPUS_ART[r].length; c++) {
      const ch = PENTAPUS_ART[r][c];
      if (ch === " ") continue;
      const hue = (c / cols) * 360;
      chars.push(
        <text
          key={`${r}-${c}`}
          x={c * CELL_W}
          y={r * CELL_H + 14}
          fill={`hsl(${hue}, 100%, 65%)`}
          fontFamily="monospace"
          fontSize="16"
          fontWeight="bold"
        >
          {ch}
        </text>
      );
    }
  }

  // 60% of static size
  const scale = 0.6;
  const displayW = artW * scale;
  const displayH = artH * scale;

  return (
    <svg
      style={{
        position: "fixed",
        left: renderPos.x - displayW / 2,
        top: renderPos.y - displayH / 2,
        width: displayW,
        height: displayH,
        opacity: 0.6,
        zIndex: 0,
        pointerEvents: "none",
      }}
      viewBox={`0 0 ${artW} ${artH}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {chars}
    </svg>
  );
}
