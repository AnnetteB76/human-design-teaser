// Human Design Berechnungs-Engine
// Nutzt die freie MIT-lizenzierte Bibliothek "astronomy-engine" (astronomy.js)
// Alles läuft lokal im Browser, keine Server-Anfrage, keine Kosten.

function zonedPartsToUtc(year, month, day, hour, minute, timeZone) {
  function getOffsetParts(date) {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    const map = {};
    for (const p of dtf.formatToParts(date)) map[p.type] = p.value;
    return Date.UTC(
      parseInt(map.year), parseInt(map.month) - 1, parseInt(map.day),
      parseInt(map.hour), parseInt(map.minute), parseInt(map.second)
    );
  }
  const wanted = Date.UTC(year, month - 1, day, hour, minute, 0);
  let guess = new Date(wanted);
  for (let i = 0; i < 3; i++) {
    const seenAsUtc = getOffsetParts(guess);
    const diff = wanted - seenAsUtc;
    guess = new Date(guess.getTime() + diff);
  }
  return guess;
}

function meanLunarNodeLongitude(time) {
  const T = time.tt / 36525;
  let lon = 125.0445222 - 1934.1362608 * T + 0.0020708 * T * T + (T * T * T) / 450000;
  return ((lon % 360) + 360) % 360;
}

const PLANET_BODIES = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

function computeActivations(time) {
  const A = Astronomy;
  const activations = {};

  activations.sun = A.SunPosition(time).elon;
  activations.earth = (activations.sun + 180) % 360;
  activations.moon = A.EclipticGeoMoon(time).lon;

  for (const name of PLANET_BODIES) {
    const vec = A.GeoVector(A.Body[name], time, true);
    activations[name.toLowerCase()] = A.Ecliptic(vec).elon;
  }

  const node = meanLunarNodeLongitude(time);
  activations.northnode = node;
  activations.southnode = (node + 180) % 360;

  const gates = {};
  const gateSet = new Set();
  for (const [body, lon] of Object.entries(activations)) {
    const gl = degreeToGateLine(lon);
    gates[body] = gl;
    gateSet.add(gl.gate);
  }
  return { gates, gateSet, sunLongitude: activations.sun };
}

function findDesignTime(personalitySunLon, birthTime) {
  const targetLon = ((personalitySunLon - 88) % 360 + 360) % 360;
  const searchStart = birthTime.AddDays(-95);
  const result = Astronomy.SearchSunLongitude(targetLon, searchStart, 15);
  if (!result) throw new Error("Design-Zeitpunkt konnte nicht berechnet werden.");
  return result;
}

function computeDefinition(gateSet) {
  const definedCenters = new Set();
  const definedChannels = [];
  const graph = {};

  function link(a, b) {
    (graph[a] = graph[a] || new Set()).add(b);
    (graph[b] = graph[b] || new Set()).add(a);
  }

  for (const channel of CHANNELS) {
    const [g1, g2, c1, c2] = channel;
    if (gateSet.has(g1) && gateSet.has(g2)) {
      definedCenters.add(c1);
      definedCenters.add(c2);
      definedChannels.push(channel);
      link(c1, c2);
    }
  }

  return { definedCenters, definedChannels, graph };
}

function determineType({ definedCenters, graph }) {
  if (definedCenters.size === 0) return "Reflector";

  const sacralDefined = definedCenters.has("sacral");

  let throatConnectedToMotor = false;
  if (definedCenters.has("throat")) {
    const visited = new Set(["throat"]);
    const queue = ["throat"];
    while (queue.length) {
      const cur = queue.shift();
      for (const next of graph[cur] || []) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
    throatConnectedToMotor = MOTOR_CENTERS.some((m) => visited.has(m));
  }

  if (sacralDefined && throatConnectedToMotor) return "Manifesting Generator";
  if (sacralDefined) return "Generator";
  if (throatConnectedToMotor) return "Manifestor";
  return "Projector";
}

function determineAuthority(definedCenters) {
  if (definedCenters.has("solarplexus")) return "Emotional";
  if (definedCenters.has("sacral")) return "Sacral";
  if (definedCenters.has("spleen")) return "Splenic";
  if (definedCenters.has("heart")) return "Ego";
  if (definedCenters.has("g")) return "SelfProjected";
  if (definedCenters.size === 0) return "Lunar";
  return "Mental";
}

function calculateHumanDesignType({ year, month, day, hour, minute, timeZone }) {
  const birthUtc = zonedPartsToUtc(year, month, day, hour, minute, timeZone);
  const birthTime = Astronomy.MakeTime(birthUtc);

  const personality = computeActivations(birthTime);
  const designTime = findDesignTime(personality.sunLongitude, birthTime);
  const design = computeActivations(designTime);

  const allGates = new Set([...personality.gateSet, ...design.gateSet]);
  const definition = computeDefinition(allGates);
  const type = determineType(definition);
  const authority = determineAuthority(definition.definedCenters);
  const profile = {
    personalityLine: personality.gates.sun.line,
    designLine: design.gates.sun.line
  };

  return {
    type,
    authority,
    profile,
    birthUtc,
    designTime: designTime.date,
    personalityGates: personality.gateSet,
    designGates: design.gateSet,
    personalityActivations: personality.gates,
    designActivations: design.gates,
    definedCenters: definition.definedCenters,
    definedChannels: definition.definedChannels
  };
}
