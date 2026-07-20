// Human Design Referenzdaten (Tore-Rad, Zentren, Kanäle)
// Quellen gegen mehrere unabhängige Referenzen abgeglichen (Juli 2026)

const GATE_SEQUENCE = [
  25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12,
  15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6,
  46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11,
  10, 58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37, 63, 22, 36
];
const GATE_WHEEL_START_DEGREE = 358.25; // 28°15' Fische = Start von Tor 25

const PLANET_ORDER = [
  "sun", "earth", "moon", "northnode", "southnode",
  "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"
];
const PLANET_SYMBOLS = {
  sun: "☉", earth: "⊕", moon: "☾", northnode: "☊", southnode: "☋",
  mercury: "☿", venus: "♀", mars: "♂", jupiter: "♃", saturn: "♄",
  uranus: "♅", neptune: "♆", pluto: "♇"
};

function degreeToGateLine(lonDeg) {
  const gateSize = 360 / 64; // 5.625°
  const lineSize = gateSize / 6; // 0.9375°
  const offset = ((lonDeg - GATE_WHEEL_START_DEGREE) % 360 + 360) % 360;
  const idx = Math.floor(offset / gateSize);
  const line = Math.floor((offset % gateSize) / lineSize) + 1;
  return { gate: GATE_SEQUENCE[idx], line };
}

const CENTERS = {
  head: [64, 61, 63],
  ajna: [47, 24, 4, 17, 43, 11],
  throat: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16],
  g: [1, 13, 25, 46, 2, 15, 10, 7],
  heart: [21, 40, 26, 51],
  sacral: [5, 14, 29, 59, 9, 3, 42, 27, 34],
  solarplexus: [6, 37, 22, 36, 30, 55, 49],
  spleen: [48, 57, 44, 50, 32, 28, 18],
  root: [58, 38, 54, 53, 60, 52, 19, 39, 41]
};

const MOTOR_CENTERS = ["sacral", "heart", "solarplexus", "root"];

// Offizielle Jovian-Archive-Farben je Zentrum (aus Annettes echtem Chart abgeglichen)
const CENTER_COLORS = {
  head: "#f4c542",
  ajna: "#3f9683",
  throat: "#8b6b4a",
  g: "#f4c542",
  heart: "#c0392b",
  sacral: "#c0392b",
  solarplexus: "#a0623c",
  spleen: "#7a5c3e",
  root: "#8b6b4a"
};

function centerOfGate(gate) {
  for (const [center, gates] of Object.entries(CENTERS)) {
    if (gates.includes(gate)) return center;
  }
  return null;
}

// [Tor A, Tor B, Center A, Center B]
const CHANNELS = [
  [1, 8, "g", "throat"],
  [2, 14, "g", "sacral"],
  [3, 60, "sacral", "root"],
  [4, 63, "ajna", "head"],
  [5, 15, "sacral", "g"],
  [6, 59, "sacral", "solarplexus"],
  [7, 31, "g", "throat"],
  [9, 52, "sacral", "root"],
  [10, 20, "g", "throat"],
  [10, 34, "g", "sacral"],
  [10, 57, "g", "spleen"],
  [11, 56, "ajna", "throat"],
  [12, 22, "throat", "solarplexus"],
  [13, 33, "g", "throat"],
  [16, 48, "throat", "spleen"],
  [17, 62, "ajna", "throat"],
  [18, 58, "spleen", "root"],
  [19, 49, "root", "solarplexus"],
  [20, 34, "throat", "sacral"],
  [20, 57, "throat", "spleen"],
  [21, 45, "heart", "throat"],
  [23, 43, "throat", "ajna"],
  [24, 61, "ajna", "head"],
  [25, 51, "g", "heart"],
  [26, 44, "heart", "spleen"],
  [27, 50, "sacral", "spleen"],
  [28, 38, "spleen", "root"],
  [29, 46, "sacral", "g"],
  [30, 41, "root", "solarplexus"],
  [32, 54, "spleen", "root"],
  [34, 57, "sacral", "spleen"],
  [35, 36, "throat", "solarplexus"],
  [37, 40, "heart", "solarplexus"],
  [39, 55, "root", "solarplexus"],
  [42, 53, "sacral", "root"],
  [47, 64, "ajna", "head"]
];

// Bodygraph-Geometrie: Koordinatenraum 852x1310, abgeleitet aus einem
// öffentlichen Referenz-Chart-Template, gegen die Zentren-Zuordnung oben verifiziert.
const BODYGRAPH_VIEWBOX = { width: 852, height: 1310 };

const CENTER_SHAPES = {
  head: { type: "triangle-up", x1: 335.1, y1: 15.1, x2: 505.4, y2: 157.5 },
  ajna: { type: "triangle-down", x1: 335.0, y1: 209.8, x2: 505.6, y2: 355.1 },
  throat: { type: "square", x1: 343.4, y1: 398.5, x2: 497.4, y2: 569.4 },
  g: { type: "diamond", x1: 317.7, y1: 590.0, x2: 523.1, y2: 795.5 },
  heart: { type: "triangle-up", x1: 520.3, y1: 746.7, x2: 668.8, y2: 839.2 },
  sacral: { type: "square", x1: 343.4, y1: 924.8, x2: 497.4, y2: 1078.8 },
  spleen: { type: "triangle-right", x1: 8.2, y1: 885.9, x2: 165.0, y2: 1063.9 },
  solarplexus: { type: "triangle-left", x1: 682.1, y1: 885.9, x2: 838.9, y2: 1063.9 },
  root: { type: "square", x1: 343.4, y1: 1149.1, x2: 497.4, y2: 1296.3 }
};

// Tor-Nummer -> Punkt am Zentrumsrand (x, y)
const GATE_COORDS = {
  1: [417.0, 623.2], 2: [415.2, 773.0], 3: [415.2, 1065.1],
  4: [451.7, 238.5], 5: [377.6, 951.5], 6: [708.2, 983.5],
  7: [378.6, 660.3], 8: [414.0, 555.4], 9: [451.6, 1066.1],
  10: [334.3, 699.3], 11: [439.2, 277.4], 12: [466.5, 490.0],
  13: [447.6, 660.3], 14: [410.2, 952.5], 15: [373.6, 741.5],
  16: [354.3, 458.8], 17: [386.3, 275.8], 18: [21.5, 1038.7],
  19: [464.8, 1208.9], 20: [352.0, 504.6], 21: [593.7, 779.0],
  22: [760.0, 946.6], 23: [411.7, 424.4], 24: [409.7, 237.6],
  25: [483.2, 698.7], 26: [543.7, 827.1], 27: [355.3, 1030.3],
  28: [52.2, 1020.6], 29: [446.6, 952.5], 30: [799.2, 1038.7],
  31: [371.0, 555.0], 32: [85.1, 1002.4], 33: [446.0, 555.4],
  34: [354.3, 988.5], 35: [464.0, 455.1], 36: [789.0, 929.6],
  37: [733.0, 961.6], 38: [352.4, 1245.8], 39: [463.7, 1245.8],
  40: [623.8, 826.4], 41: [464.7, 1281.6], 42: [369.6, 1065.1],
  43: [408.7, 323.8], 44: [84.0, 963.0], 45: [463.0, 523.4],
  46: [444.6, 739.5], 47: [370.2, 238.6], 48: [18.4, 924.9],
  49: [734.5, 1003.4], 50: [117.4, 983.5], 51: [568.7, 803.1],
  52: [446.6, 1176.0], 53: [370.6, 1176.0], 54: [352.4, 1209.0],
  55: [767.4, 1020.6], 56: [449.0, 425.2], 57: [53.3, 945.2],
  58: [352.4, 1281.6], 59: [463.4, 1030.3], 60: [408.1, 1176.0],
  61: [409.5, 140.8], 62: [370.2, 424.4], 63: [448.1, 141.8],
  64: [367.2, 140.8]
};
