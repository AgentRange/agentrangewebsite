const CELL_W = 10;
const CELL_H = 18;

function charToHue(colIndex, totalCols) {
  return (colIndex / totalCols) * 360;
}

export default function AsciiSvg({ lines, rainbow = true, className = "", maxWidth = 960 }) {
  const rows = lines.length;
  const cols = Math.max(...lines.map((l) => l.length));
  const width = cols * CELL_W;
  const height = rows * CELL_H;

  const chars = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < lines[r].length; c++) {
      const ch = lines[r][c];
      if (ch === " ") continue;
      const hue = rainbow ? charToHue(c, cols) : 0;
      const fill = rainbow ? `hsl(${hue}, 100%, 65%)` : "#ccc";
      chars.push(
        <text
          key={`${r}-${c}`}
          x={c * CELL_W}
          y={r * CELL_H + 14}
          fill={fill}
          fontFamily="monospace"
          fontSize="16"
        >
          {ch}
        </text>
      );
    }
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", maxWidth }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {chars}
    </svg>
  );
}
