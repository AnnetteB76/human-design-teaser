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

// Bodygraph-Geometrie: exakt aus Annettes Canva-Vorlage vermessen (per
// Bildanalyse, verbindliche Farbflächen erkannt statt geschätzt), damit
// die eigenen Formen bit-genau auf die aus der Vorlage ausgeschnittene
// Silhouette (silhouette.png) passen. Koordinatenraum = Silhouette-Bildmaß.
const BODYGRAPH_VIEWBOX = { width: 700, height: 792 };

const CENTER_SHAPES = {
  head: { type: "triangle-up", x1: 276.6, y1: 46.8, x2: 360.1, y2: 109.0 },
  ajna: { type: "triangle-down", x1: 276.6, y1: 152.8, x2: 360.1, y2: 215.6 },
  throat: { type: "square", x1: 283.7, y1: 261.8, x2: 355.3, y2: 333.4 },
  g: { type: "diamond", x1: 270.6, y1: 375.5, x2: 369.5, y2: 474.4 },
  heart: { type: "triangle-up", x1: 369.0, y1: 445.9, x2: 477.3, y2: 507.5 },
  sacral: { type: "square", x1: 281.9, y1: 560.8, x2: 354.1, y2: 632.5 },
  spleen: { type: "triangle-right", x1: 90.6, y1: 548.4, x2: 159.3, y2: 641.4 },
  solarplexus: { type: "triangle-left", x1: 485.6, y1: 549.0, x2: 554.3, y2: 641.4 },
  root: { type: "square", x1: 283.1, y1: 675.7, x2: 354.7, y2: 747.4 }
};

// Tor-Nummer -> Punkt am Zentrumsrand (x, y)
const GATE_COORDS = {
  1: [318.4, 391.5], 2: [317.5, 463.6], 3: [315.6, 626.1], 4: [333.7, 165.2],
  5: [297.9, 573.2], 6: [497.0, 599.7], 7: [299.9, 409.3], 8: [316.5, 327.5],
  9: [332.6, 626.6], 10: [278.6, 428.1], 11: [327.6, 182.0], 12: [340.9, 300.1],
  13: [333.1, 409.3], 14: [313.2, 573.7], 15: [297.5, 448.4], 16: [288.8, 287.1],
  17: [301.7, 181.3], 18: [96.4, 628.2], 19: [339.5, 704.8], 20: [287.7, 306.3],
  21: [422.5, 467.4], 22: [519.7, 580.5], 23: [315.5, 272.7], 24: [313.2, 164.8],
  25: [350.3, 427.8], 26: [386.1, 499.4], 27: [287.5, 609.9], 28: [109.9, 618.8],
  29: [330.3, 573.7], 30: [536.9, 628.3], 31: [296.5, 327.4], 32: [124.3, 609.3],
  33: [331.4, 327.5], 34: [287.0, 590.5], 35: [339.8, 285.5], 36: [532.4, 571.7],
  37: [507.9, 588.3], 38: [287.3, 722.8], 39: [339.0, 722.8], 40: [444.5, 499.0],
  41: [339.5, 740.2], 42: [294.2, 626.1], 43: [312.7, 202.1], 44: [123.8, 588.7],
  45: [339.3, 314.1], 46: [331.7, 447.4], 47: [293.8, 165.2], 48: [95.1, 568.8],
  49: [508.6, 610.0], 50: [138.4, 599.4], 51: [404.3, 483.5], 52: [331.1, 688.8],
  53: [295.7, 688.8], 54: [287.3, 704.9], 55: [523.0, 618.9], 56: [332.8, 273.0],
  57: [110.4, 579.4], 58: [287.3, 740.2], 59: [338.2, 609.9], 60: [313.2, 688.8],
  61: [313.1, 101.7], 62: [296.2, 272.7], 63: [332.0, 102.1], 64: [292.3, 101.7]
};
