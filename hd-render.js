// Zeichnet den Bodygraph nach Annettes eigener Canva-Vorlage: cremefarbene
// Zentren (offen) / Rosé-Magenta (definiert), graue Kanten, schlichte
// Zahlen ohne Kreise, feines graues Liniennetz im Hintergrund, eigene
// Meditations-Silhouette in Rosé. Schwarz = Personality, Rot = Design.

const GATE_INK = {
  personality: "#161113",
  design: "#b3261e",
  both: "#6b1530",
  none: "#b8afa6"
};

const CENTER_FILL_DEFINED = "#b8558b";
const CENTER_FILL_OPEN = "#fff5f0";
const CENTER_BORDER = "#9b9490";

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

function shapeCentroid(shape) {
  return [(shape.x1 + shape.x2) / 2, (shape.y1 + shape.y2) / 2];
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
// Zahlen vollständig innerhalb der Zentrums-Form bleiben (nicht über den Rand hinausragen).
function insetGateCoord(gate) {
  const shape = CENTER_SHAPES[centerOfGate(gate)];
  const [cx, cy] = shapeCentroid(shape);
  const [gx, gy] = GATE_COORDS[gate];
  const dx = gx - cx;
  const dy = gy - cy;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = dx / dist;
  const ny = dy / dist;
  const shrunkDist = Math.max(dist * 0.78 - 6, 0);
  return [cx + nx * shrunkDist, cy + ny * shrunkDist];
}

// Gerade Linie von (x1,y1) nach (x2,y2), in der Mitte für die zweifarbige
// (Schwarz/Rot) Kanal-Linie geteilt.
function straightChannelHalves(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return {
    first: `M ${x1},${y1} L ${mx},${my}`,
    second: `M ${mx},${my} L ${x2},${y2}`
  };
}

// Silhouette ist ein aus Annettes eigener Canva-Vorlage ausgeschnittenes
// Bild (silhouette.png, nur die Rosé-Fläche, Zentren-Formen als Löcher
// entfernt), kein gezeichneter Pfad mehr — sieht dadurch echt menschlich aus.
const SILHOUETTE_IMAGE = {
  href: "silhouette.png",
  naturalWidth: 700,
  naturalHeight: 792
};

// Feine graue Linien für die tatsächlichen 36 Kanäle (nicht alle Zentren
// wild untereinander), als "Potential"-Andeutung hinter den echten,
// aktiven Kanal-Linien — wie in Annettes Vorlage.
function potentialChannelLines(definedChannels) {
  const definedSet = new Set(definedChannels.map(([g1, g2]) => `${g1}-${g2}`));
  const parts = [];
  for (const [g1, g2] of CHANNELS) {
    if (definedSet.has(`${g1}-${g2}`)) continue;
    const [x1, y1] = insetGateCoord(g1);
    const [x2, y2] = insetGateCoord(g2);
    parts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e4dfda" stroke-width="1.5"/>`);
  }
  return parts.join("");
}

function renderBodygraphSvg({ personalityGates, designGates, definedCenters, definedChannels }) {
  const { height } = BODYGRAPH_VIEWBOX;
  const chartCenterX = 420;
  const imgHeight = height + 110;
  const imgWidth = imgHeight * (SILHOUETTE_IMAGE.naturalWidth / SILHOUETTE_IMAGE.naturalHeight);
  const imgX = chartCenterX - imgWidth / 2;
  const imgY = -60;
  const viewMinX = Math.min(imgX, 0) - 15;
  const viewMinY = -30;
  const viewWidth = Math.max(imgX + imgWidth, BODYGRAPH_VIEWBOX.width) - viewMinX + 15;
  const viewHeight = height + 60;

  const parts = [];
  parts.push(`<svg viewBox="${viewMinX} ${viewMinY} ${viewWidth} ${viewHeight}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dein Human Design Bodygraph">`);

  parts.push(`<image href="${SILHOUETTE_IMAGE.href}" x="${imgX}" y="${imgY}" width="${imgWidth}" height="${imgHeight}" preserveAspectRatio="xMidYMid meet"/>`);

  parts.push('<g class="hd-mesh">');
  parts.push(potentialChannelLines(definedChannels));
  parts.push("</g>");

  parts.push('<g class="hd-centers">');
  for (const [name, shape] of Object.entries(CENTER_SHAPES)) {
    const path = roundedPolygonPath(shapePoints(shape), 10);
    const defined = definedCenters.has(name);
    const fill = defined ? CENTER_FILL_DEFINED : CENTER_FILL_OPEN;
    parts.push(`<path d="${path}" fill="${fill}" stroke="${CENTER_BORDER}" stroke-width="2" stroke-linejoin="round"/>`);
  }
  parts.push("</g>");

  parts.push('<g class="hd-channels" fill="none">');
  for (const [g1, g2] of definedChannels) {
    const [x1, y1] = insetGateCoord(g1);
    const [x2, y2] = insetGateCoord(g2);
    const c1 = GATE_INK[gateState(g1, personalityGates, designGates)] || GATE_INK.design;
    const c2 = GATE_INK[gateState(g2, personalityGates, designGates)] || GATE_INK.design;
    const { first, second } = straightChannelHalves(x1, y1, x2, y2);
    parts.push(`<path d="${first}" stroke="${c1}" stroke-width="4" stroke-linecap="round"/>`);
    parts.push(`<path d="${second}" stroke="${c2}" stroke-width="4" stroke-linecap="round"/>`);
  }
  parts.push("</g>");

  parts.push('<g class="hd-gates">');
  for (const gateStr of Object.keys(GATE_COORDS)) {
    const gate = parseInt(gateStr);
    const [x, y] = insetGateCoord(gate);
    const state = gateState(gate, personalityGates, designGates);
    const defined = definedCenters.has(centerOfGate(gate));
    let textColor = GATE_INK.none;
    if (state === "personality") textColor = GATE_INK.personality;
    else if (state === "design") textColor = GATE_INK.design;
    else if (state === "both") textColor = GATE_INK.both;
    if (state === "none" && defined) textColor = "#f3e2ea";

    parts.push(
      `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" font-family="Inter, sans-serif" fill="${textColor}">${gate}</text>`
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
