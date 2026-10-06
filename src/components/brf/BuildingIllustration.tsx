import { cn } from "@/lib/utils";
import type { Status } from "@/data/overview";

export const VIEW_W = 900;
export const VIEW_H = 620;

/** Ankarpunkt för statusmarkören, i illustrationens koordinatsystem. */
export const areaMarkers: Record<string, { x: number; y: number }> = {
  tak: { x: 450, y: 88 },
  fasad: { x: 262, y: 196 },
  fonster: { x: 382, y: 306 },
  hiss: { x: 458, y: 300 },
  el: { x: 629, y: 214 },
  garage: { x: 134, y: 430 },
  tvattstuga: { x: 288, y: 518 },
  varme: { x: 438, y: 518 },
  va: { x: 588, y: 518 },
  dranering: { x: 452, y: 580 },
};

const statusStroke: Record<Status, string> = {
  good: "var(--status-good)",
  watch: "var(--status-watch)",
  alert: "var(--status-alert)",
  neutral: "var(--status-neutral)",
};

type Shape =
  | { kind: "rect"; x: number; y: number; w: number; h: number; r?: number }
  | { kind: "path"; d: string };

const areaShapes: Record<string, Shape> = {
  tak: { kind: "path", d: "M188 132 L450 44 L712 132 Z" },
  fasad: { kind: "rect", x: 216, y: 132, w: 114, h: 338, r: 6 },
  fonster: { kind: "rect", x: 336, y: 146, w: 92, h: 324, r: 6 },
  hiss: { kind: "rect", x: 436, y: 140, w: 46, h: 330, r: 6 },
  el: { kind: "rect", x: 598, y: 146, w: 60, h: 324, r: 6 },
  garage: { kind: "rect", x: 58, y: 390, w: 152, h: 80, r: 8 },
  tvattstuga: { kind: "rect", x: 216, y: 476, w: 146, h: 82, r: 6 },
  varme: { kind: "rect", x: 366, y: 476, w: 146, h: 82, r: 6 },
  va: { kind: "rect", x: 516, y: 476, w: 146, h: 82, r: 6 },
  dranering: { kind: "rect", x: 196, y: 564, w: 490, h: 28, r: 12 },
};

function HighlightShape({ id, status }: { id: string; status: Status }) {
  const shape = areaShapes[id];
  if (!shape) return null;
  const common = {
    fill: statusStroke[status],
    fillOpacity: 0.14,
    stroke: statusStroke[status],
    strokeOpacity: 0.65,
    strokeWidth: 2.5,
  };
  return shape.kind === "rect" ? (
    <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.r ?? 6} {...common} />
  ) : (
    <path d={shape.d} {...common} />
  );
}

const line = "oklch(0.85 0.008 95)";
const lineSoft = "oklch(0.9 0.006 95)";
const glass = "oklch(0.88 0.022 220)";
const tech = "oklch(0.55 0.02 165)";

export function BuildingIllustration({
  className,
  highlight,
}: {
  className?: string;
  highlight?: { id: string; status: Status } | null;
}) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="Genomskärning av föreningens flerbostadshus med fastighetens olika delar"
    >
      <defs>
        <linearGradient id="bi-facade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.975 0.006 95)" />
          <stop offset="100%" stopColor="oklch(0.935 0.009 95)" />
        </linearGradient>
        <linearGradient id="bi-roof" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.56 0.02 165)" />
          <stop offset="100%" stopColor="oklch(0.42 0.02 165)" />
        </linearGradient>
        <linearGradient id="bi-interior" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.99 0.003 95)" />
          <stop offset="100%" stopColor="oklch(0.96 0.005 95)" />
        </linearGradient>
      </defs>

      {/* mark */}
      <rect x="0" y="470" width="900" height="4" rx="2" fill="oklch(0.88 0.008 95)" />
      <rect x="0" y="474" width="900" height="146" fill="oklch(0.978 0.005 95)" />

      {/* träd */}
      <g>
        <circle cx="768" cy="424" r="30" fill="oklch(0.92 0.03 155)" />
        <rect x="765" y="424" width="6" height="46" rx="3" fill="oklch(0.84 0.018 95)" />
        <circle cx="822" cy="440" r="20" fill="oklch(0.93 0.026 155)" />
        <rect x="819" y="440" width="5" height="30" rx="2.5" fill="oklch(0.84 0.018 95)" />
      </g>

      {/* garage / parkering */}
      <g>
        <rect x="58" y="390" width="152" height="80" rx="8" fill="oklch(0.955 0.007 95)" />
        <rect
          x="58"
          y="390"
          width="152"
          height="80"
          rx="8"
          fill="none"
          stroke={line}
          strokeWidth="2"
        />
        <rect x="50" y="382" width="168" height="12" rx="6" fill={tech} opacity="0.85" />
        <rect x="86" y="414" width="96" height="56" rx="4" fill="oklch(0.92 0.008 95)" />
        {[96, 116, 136, 156].map((x) => (
          <line key={x} x1={x} y1="414" x2={x} y2="470" stroke={lineSoft} strokeWidth="2" />
        ))}
      </g>

      {/* huvudbyggnad */}
      <rect x="216" y="132" width="442" height="338" rx="8" fill="url(#bi-facade)" />

      {/* genomskärning: interiör höger del */}
      <rect x="430" y="140" width="228" height="330" rx="4" fill="url(#bi-interior)" />
      {[140, 222, 304, 386].map((y) => (
        <g key={y}>
          <rect x="430" y={y} width="228" height="6" fill="oklch(0.9 0.008 95)" />
        </g>
      ))}
      <rect x="430" y="464" width="228" height="6" fill="oklch(0.9 0.008 95)" />

      {/* möbler/rumsandydning i genomskärningen */}
      {[190, 272, 354, 436].map((y) => (
        <g key={`room-${y}`} opacity="0.6">
          <rect x="496" y={y - 20} width="40" height="20" rx="3" fill="oklch(0.93 0.01 95)" />
          <rect x="548" y={y - 12} width="26" height="12" rx="3" fill="oklch(0.93 0.01 95)" />
        </g>
      ))}

      {/* hisschakt */}
      <g>
        <rect x="436" y="140" width="46" height="330" rx="4" fill="oklch(0.955 0.007 95)" />
        <rect
          x="436"
          y="140"
          width="46"
          height="330"
          rx="4"
          fill="none"
          stroke={line}
          strokeWidth="2"
        />
        <line x1="459" y1="140" x2="459" y2="470" stroke={lineSoft} strokeWidth="2" />
        <rect x="443" y="330" width="32" height="52" rx="3" fill={tech} opacity="0.6" />
      </g>

      {/* el- och styrschakt */}
      <g>
        <rect x="598" y="146" width="60" height="324" rx="4" fill="oklch(0.96 0.007 95)" />
        <line
          x1="628"
          y1="152"
          x2="628"
          y2="464"
          stroke={tech}
          strokeWidth="2.5"
          strokeDasharray="10 8"
          opacity="0.7"
        />
        {[190, 272, 354, 436].map((y) => (
          <rect key={y} x="614" y={y} width="28" height="14" rx="3" fill="oklch(0.92 0.01 95)" />
        ))}
      </g>

      {/* fasadkontur */}
      <rect
        x="216"
        y="132"
        width="442"
        height="338"
        rx="8"
        fill="none"
        stroke={line}
        strokeWidth="2"
      />
      <line x1="430" y1="140" x2="430" y2="470" stroke={line} strokeWidth="2" />

      {/* fönsterband */}
      {[158, 240, 322, 400].map((y) => (
        <g key={`win-${y}`}>
          <rect x="246" y={y} width="42" height="50" rx="4" fill={glass} />
          <rect
            x="246"
            y={y}
            width="42"
            height="50"
            rx="4"
            fill="none"
            stroke="oklch(0.84 0.008 95)"
            strokeWidth="2"
          />
          <line x1="267" y1={y} x2="267" y2={y + 50} stroke={lineSoft} strokeWidth="2" />
          <rect x="348" y={y} width="66" height="50" rx="4" fill={glass} />
          <rect
            x="348"
            y={y}
            width="66"
            height="50"
            rx="4"
            fill="none"
            stroke="oklch(0.84 0.008 95)"
            strokeWidth="2"
          />
          <line x1="381" y1={y} x2="381" y2={y + 50} stroke={lineSoft} strokeWidth="2" />
        </g>
      ))}

      {/* entré */}
      <rect x="246" y="410" width="42" height="60" rx="4" fill={tech} opacity="0.5" />

      {/* tak */}
      <path d="M188 132 L450 44 L712 132 Z" fill="url(#bi-roof)" />
      <rect x="188" y="126" width="524" height="14" rx="7" fill="oklch(0.46 0.02 165)" />
      <rect x="512" y="76" width="24" height="42" rx="4" fill="oklch(0.5 0.02 165)" />

      {/* källarplan */}
      <g>
        <rect x="216" y="476" width="446" height="82" rx="6" fill="oklch(0.945 0.008 95)" />
        <rect
          x="216"
          y="476"
          width="446"
          height="82"
          rx="6"
          fill="none"
          stroke={line}
          strokeWidth="2"
        />
        <line x1="364" y1="476" x2="364" y2="558" stroke={line} strokeWidth="2" />
        <line x1="514" y1="476" x2="514" y2="558" stroke={line} strokeWidth="2" />
        {/* tvättstuga: maskiner */}
        <rect x="240" y="500" width="26" height="30" rx="3" fill="oklch(0.9 0.012 95)" />
        <circle cx="253" cy="515" r="7" fill={glass} />
        <rect x="276" y="500" width="26" height="30" rx="3" fill="oklch(0.9 0.012 95)" />
        <circle cx="289" cy="515" r="7" fill={glass} />
        {/* teknikrum: värme/ventilation */}
        <rect x="392" y="496" width="34" height="38" rx="4" fill={tech} opacity="0.5" />
        <path
          d="M432 502 h44 M432 516 h44 M432 530 h44"
          stroke={tech}
          strokeWidth="2.5"
          opacity="0.5"
        />
        {/* VA: rör */}
        <path
          d="M534 484 v40 h96"
          fill="none"
          stroke={tech}
          strokeWidth="3"
          opacity="0.55"
          strokeLinecap="round"
        />
        <circle cx="534" cy="524" r="5" fill={tech} opacity="0.55" />
      </g>

      {/* dränering under mark */}
      <g>
        <path
          d="M196 578 h490"
          stroke={tech}
          strokeWidth="3"
          strokeDasharray="12 10"
          opacity="0.45"
          strokeLinecap="round"
        />
        {[236, 316, 396, 476, 556, 636].map((x) => (
          <line
            key={x}
            x1={x}
            y1="562"
            x2={x}
            y2="578"
            stroke={tech}
            strokeWidth="2"
            opacity="0.3"
          />
        ))}
      </g>

      {highlight ? <HighlightShape id={highlight.id} status={highlight.status} /> : null}
    </svg>
  );
}
