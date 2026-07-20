// Zeichnet den Bodygraph im offiziellen Jovian-Archive-Stil (gegen Annettes
// echtes Chart abgeglichen): heller Untergrund, Zentren in eigenen Farben,
// abgerundete Ecken, geschwungene Kanäle, Schwarz = Personality, Rot = Design.

const GATE_INK = {
  personality: "#161113",
  design: "#b3261e",
  none: "#c9c2b4",
  noneText: "#a39c8c"
};

function shapePoints(shape) {
  const { type, x1, y1, x2, y2 } = shape;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  switch (type) {
    case "triangle-up":
      return [[cx, y1], [x1, y2], [x2, y2]];
    case "triangle-down":
      return [[x1, y1], [x2, y1], [cx, y2]];
    case "triangle-right":
      return [[x1, y1], [x1, y2], [x2, cy]];
    case "triangle-left":
      return [[x2, y1], [x2, y2], [x1, cy]];
    case "diamond":
      return [[cx, y1], [x2, cy], [cx, y2], [x1, cy]];
    case "square":
    default:
      return [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
  }
}

// Baut einen SVG-Pfad mit abgerundeten Ecken für ein beliebiges Polygon
// (funktioniert für Quadrat, Dreiecke und Raute gleichermaßen).
function roundedPolygonPath(points, radius) {
  const n = points.length;
  const parts = [];
  for (let i = 0; i < n; i++) {
    const curr = points[i];
    const prev = points[(i - 1 + n) % n];
    const next = points[(i + 1) % n];

    const distPrev = Math.hypot(prev[0] - curr[0], prev[1] - curr[1]);
    const distNext = Math.hypot(next[0] - curr[0], next[1] - curr[1]);
    const r = Math.min(radius, distPrev / 2, distNext / 2);

    const towardPrev = [(prev[0] - curr[0]) / distPrev, (prev[1] - curr[1]) / distPrev];
    const towardNext = [(next[0] - curr[0]) / distNext, (next[1] - curr[1]) / distNext];

    const p1 = [curr[0] + towardPrev[0] * r, curr[1] + towardPrev[1] * r];
    const p2 = [curr[0] + towardNext[0] * r, curr[1] + towardNext[1] * r];

    parts.push(i === 0 ? `M ${p1[0]},${p1[1]}` : `L ${p1[0]},${p1[1]}`);
    parts.push(`Q ${curr[0]},${curr[1]} ${p2[0]},${p2[1]}`);
  }
  parts.push("Z");
  return parts.join(" ");
}

function gateState(gate, personalityGates, designGates) {
  const inP = personalityGates.has(gate);
  const inD = designGates.has(gate);
  if (inP && inD) return "both";
  if (inP) return "personality";
  if (inD) return "design";
  return "none";
}

// Zieht die Tor-Position etwas Richtung Zentrums-Mittelpunkt, damit die
// Kreise vollständig innerhalb der Zentrums-Form bleiben (nicht über den Rand hinausragen).
function insetGateCoord(gate) {
  const shape = CENTER_SHAPES[centerOfGate(gate)];
  const cx = (shape.x1 + shape.x2) / 2;
  const cy = (shape.y1 + shape.y2) / 2;
  const [gx, gy] = GATE_COORDS[gate];
  const dx = gx - cx;
  const dy = gy - cy;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = dx / dist;
  const ny = dy / dist;
  const shrunkDist = Math.max(dist * 0.8 - 7, 0);
  return [cx + nx * shrunkDist, cy + ny * shrunkDist];
}

// Gerade Linie von (x1,y1) nach (x2,y2), in der Mitte für die zweifarbige
// (Schwarz/Rot) Kanal-Linie geteilt. Jovian Archive zeichnet Kanäle gerade,
// keine Kurven — vorherige Bogen-Variante war der Fehler.
function straightChannelHalves(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return {
    first: `M ${x1},${y1} L ${mx},${my}`,
    second: `M ${mx},${my} L ${x2},${y2}`
  };
}

// Eigene, generische Meditations-Silhouette hinter dem Chart (keine Kopie
// einer bestehenden Grafik) — sitzende Figur, Hände auf den Knien. Punkte im
// Uhrzeigersinn, über die bestehende roundedPolygonPath-Funktion geglättet.
function bodySilhouettePoints() {
  return [
    [420, 10], [495, 60], [490, 130], [450, 175],
    [570, 225], [620, 320], [640, 460], [700, 600], [720, 690],
    [790, 770], [750, 950], [560, 1100], [420, 1160], [280, 1100],
    [90, 950], [50, 770], [120, 690], [140, 600], [200, 460], [220, 320],
    [270, 225], [390, 175], [330, 130], [345, 60]
  ];
}

function renderBodygraphSvg({ personalityGates, designGates, definedCenters, definedChannels }) {
  const { width, height } = BODYGRAPH_VIEWBOX;
  const parts = [];
  parts.push(`<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dein Human Design Bodygraph">`);

  parts.push(
    '<defs><filter id="hd-shadow" x="-30%" y="-30%" width="160%" height="160%">' +
      '<feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.25"/>' +
    '</filter></defs>'
  );

  parts.push(`<path d="${roundedPolygonPath(bodySilhouettePoints(), 55)}" fill="#eee7d8" stroke="#ddd3bd" stroke-width="1.5"/>`);

  parts.push('<g class="hd-centers">');
  for (const [name, shape] of Object.entries(CENTER_SHAPES)) {
    const path = roundedPolygonPath(shapePoints(shape), 14);
    const defined = definedCenters.has(name);
    const fill = defined ? CENTER_COLORS[name] : "#ffffff";
    parts.push(
      `<path d="${path}" fill="${fill}" stroke="#8a8378" stroke-width="1.25" stroke-linejoin="round" filter="${defined ? "url(#hd-shadow)" : "none"}"/>`
    );
  }
  parts.push("</g>");

  parts.push('<g class="hd-channels" fill="none">');
  for (const [g1, g2] of definedChannels) {
    const [x1, y1] = insetGateCoord(g1);
    const [x2, y2] = insetGateCoord(g2);
    const c1 = GATE_INK[gateState(g1, personalityGates, designGates)] || GATE_INK.design;
    const c2 = GATE_INK[gateState(g2, personalityGates, designGates)] || GATE_INK.design;
    const { first, second } = straightChannelHalves(x1, y1, x2, y2);
    parts.push(`<path d="${first}" stroke="${c1}" stroke-width="3.5" stroke-linecap="round"/>`);
    parts.push(`<path d="${second}" stroke="${c2}" stroke-width="3.5" stroke-linecap="round"/>`);
  }
  parts.push("</g>");

  parts.push('<g class="hd-gates">');
  for (const gateStr of Object.keys(GATE_COORDS)) {
    const gate = parseInt(gateStr);
    const [x, y] = insetGateCoord(gate);
    const state = gateState(gate, personalityGates, designGates);
    const lit = state !== "none";

    let fill = "#ffffff";
    let stroke = GATE_INK.none;
    let textColor = GATE_INK.noneText;

    if (state === "personality") { fill = "#ffffff"; stroke = GATE_INK.personality; textColor = GATE_INK.personality; }
    if (state === "design") { fill = "#ffffff"; stroke = GATE_INK.design; textColor = GATE_INK.design; }
    if (state === "both") { fill = GATE_INK.personality; stroke = GATE_INK.design; textColor = "#ffffff"; }

    parts.push(`<circle cx="${x}" cy="${y}" r="8.5" fill="${fill}" stroke="${stroke}" stroke-width="${state === "both" ? 2 : 1.25}"/>`);
    parts.push(
      `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="8.5" font-weight="${lit ? 700 : 400}" font-family="Inter, sans-serif" fill="${textColor}">${gate}</text>`
    );
  }
  parts.push("</g>");

  parts.push("</svg>");
  return parts.join("");
}

// HTML-Tabelle (Design oder Personality) mit Planeten-Symbolen und Tor.Linie-Werten.
function renderPlanetTable(activations, label, colorClass) {
  const rows = PLANET_ORDER.map((body) => {
    const a = activations[body];
    return `<div class="hd-planet-row"><span class="hd-planet-symbol">${PLANET_SYMBOLS[body]}</span><span class="hd-planet-value">${a.gate}.${a.line}</span></div>`;
  }).join("");
  return `<div class="hd-planet-table ${colorClass}"><div class="hd-planet-header">${label}</div>${rows}</div>`;
}
