"use strict";

const sceneById = {
  school: {
    title: "Bij de school",
    person: "Meester Jef Warnier",
    picture: "school.webp",
    fallback: "../lesgame/beelden/09-cc889f5d4b.webp",
    direction: [-0.35, -0.04],
    conversation: "meester",
  },
  cafe: {
    title: "Café Van Hoven",
    person: "De cafémedewerker",
    picture: "cafe.webp",
    fallback: "../lesgame/beelden/02-50413d5d84.webp",
    direction: [0.15, -0.06],
    conversation: "cafeBinnen",
  },
};

const canvas = document.querySelector("#view");
const fallback = document.querySelector("#fallback");
const marker = document.querySelector("#person");
const notice = document.querySelector("#notice");
const place = document.querySelector("#place");
const help = document.querySelector("#help");
const sceneButtons = document.querySelectorAll("[data-scene]");
const compare = document.querySelector("#compare");
const recenter = document.querySelector("#recenter");
const dialog = document.querySelector("#conversation");
const heading = document.querySelector("#conversation-title");
const speech = document.querySelector("#speech");
const answers = document.querySelector("#answers");

let gl;
let softwareView;
let renderPanorama;
try {
  gl = canvas.getContext("webgl", { alpha: false });
  if (gl) renderPanorama = createRenderer(gl);
} catch (error) {
  console.warn(error);
}
let usingSoftware = !renderPanorama;
if (usingSoftware) renderPanorama = createSoftwareRenderer();

const verticalLimit = Math.PI / 2 - 0.04;
const field = Math.tan(Math.PI / 6);
let yaw = 0;
let pitch = 0;
let sceneId = "";
let ready = false;
let flat = !renderPanorama;
let frame;
let drag;
const completed = new Set();
const pictures = new Map();

function createRenderer(gl) {
  const program = gl.createProgram();
  const shaders = [
    [gl.VERTEX_SHADER, `
      attribute vec2 position;
      varying vec2 screen;
      void main() {
        screen = position;
        gl_Position = vec4(position, 0.0, 1.0);
      }`],
    [gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying vec2 screen;
      uniform vec2 angle;
      uniform vec2 view;
      uniform sampler2D panorama;
      const float pi = 3.14159265359;
      void main() {
        vec3 ray = normalize(vec3(screen * view, 1.0));
        float cp = cos(angle.y), sp = sin(angle.y);
        float cy = cos(angle.x), sy = sin(angle.x);
        vec3 tilted = vec3(ray.x, cp * ray.y + sp * ray.z, cp * ray.z - sp * ray.y);
        vec3 direction = vec3(cy * tilted.x + sy * tilted.z, tilted.y, cy * tilted.z - sy * tilted.x);
        vec2 uv = vec2(fract(0.5 + atan(direction.x, direction.z) / (2.0 * pi)),
                       0.5 - asin(clamp(direction.y, -1.0, 1.0)) / pi);
        gl_FragColor = texture2D(panorama, uv);
      }`],
  ];
  for (const [kind, source] of shaders) {
    const shader = gl.createShader(kind);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const angle = gl.getUniformLocation(program, "angle");
  const view = gl.getUniformLocation(program, "view");

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return {
    load(image) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      if (gl.getError() !== gl.NO_ERROR) throw new Error("De panoramafoto kon niet worden geladen.");
    },
    draw(horizontal, vertical, scale) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(angle, horizontal, vertical);
      gl.uniform2f(view, scale, field);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };
}

function createSoftwareRenderer() {
  if (!softwareView) {
    softwareView = document.createElement("canvas");
    softwareView.setAttribute("aria-hidden", "true");
    softwareView.style.pointerEvents = "none";
    canvas.after(softwareView);
  }
  const output = softwareView.getContext("2d", { alpha: false });
  const sheet = document.createElement("canvas");
  const source = sheet.getContext("2d", { willReadFrequently: true });
  if (!output || !source) return undefined;
  let pixels;
  let viewport;
  return {
    load(image) {
      sheet.width = image.naturalWidth;
      sheet.height = image.naturalHeight;
      source.drawImage(image, 0, 0);
      pixels = source.getImageData(0, 0, sheet.width, sheet.height).data;
    },
    draw(horizontal, vertical, scale) {
      const reduction = Math.min(680 / canvas.width, 510 / canvas.height, 1);
      const width = Math.max(1, Math.round(canvas.width * reduction));
      const height = Math.max(1, Math.round(canvas.height * reduction));
      if (!viewport || width !== viewport.width || height !== viewport.height) {
        softwareView.width = width;
        softwareView.height = height;
        viewport = output.createImageData(width, height);
      }
      const cp = Math.cos(vertical), sp = Math.sin(vertical);
      const cy = Math.cos(horizontal), sy = Math.sin(horizontal);
      const { data } = viewport;
      const textureWidth = sheet.width, textureHeight = sheet.height;
      let target = 0;
      for (let y = 0; y < height; y++) {
        const viewY = (1 - (y + 0.5) * 2 / height) * field;
        const tiltY = cp * viewY + sp;
        const tiltZ = cp - sp * viewY;
        for (let x = 0; x < width; x++) {
          const viewX = ((x + 0.5) * 2 / width - 1) * scale;
          const east = cy * viewX + sy * tiltZ;
          const north = cy * tiltZ - sy * viewX;
          const u = 0.5 + Math.atan2(east, north) / (2 * Math.PI);
          const v = 0.5 - Math.atan2(tiltY, Math.sqrt(viewX * viewX + tiltZ * tiltZ)) / Math.PI;
          const textureX = Math.floor(u * textureWidth) % textureWidth;
          const textureY = Math.min(textureHeight - 1, Math.floor(v * textureHeight));
          const pixel = (textureY * textureWidth + textureX) * 4;
          data[target++] = pixels[pixel];
          data[target++] = pixels[pixel + 1];
          data[target++] = pixels[pixel + 2];
          data[target++] = 255;
        }
      }
      output.putImageData(viewport, 0, 0);
    },
  };
}

function draw() {
  frame = undefined;
  if (!ready) return;
  if (flat) {
    marker.hidden = false;
    marker.style.left = "50%";
    marker.style.top = "48%";
    return;
  }
  const { clientWidth: width, clientHeight: height } = canvas;
  if (!width || !height) return;
  const ratio = Math.min(window.devicePixelRatio, 2);
  const pixelsWide = Math.round(width * ratio);
  const pixelsHigh = Math.round(height * ratio);
  if (canvas.width !== pixelsWide || canvas.height !== pixelsHigh) {
    canvas.width = pixelsWide;
    canvas.height = pixelsHigh;
  }
  const scale = field * width / height;
  renderPanorama.draw(yaw, pitch, scale);

  const [longitude, latitude] = sceneById[sceneId].direction;
  const relative = longitude - yaw;
  const along = Math.cos(latitude) * Math.cos(relative);
  const up = Math.sin(latitude);
  const depth = along * Math.cos(pitch) + up * Math.sin(pitch);
  const x = (1 + Math.cos(latitude) * Math.sin(relative) / (depth * scale)) * width / 2;
  const y = (1 - (up * Math.cos(pitch) - along * Math.sin(pitch)) / (depth * field)) * height / 2;
  const margin = marker.getBoundingClientRect().width / 2 || 86;
  marker.hidden = depth <= 0 || x < margin + 6 || x > width - margin - 6 || y < 90 || y > height - 100;
  if (!marker.hidden) {
    marker.style.left = x + "px";
    marker.style.top = y + "px";
  }
}

function requestDraw() {
  frame ??= requestAnimationFrame(draw);
}

function look(horizontal, vertical) {
  yaw = Math.atan2(Math.sin(horizontal), Math.cos(horizontal));
  pitch = Math.max(-verticalLimit, Math.min(verticalLimit, vertical));
  requestDraw();
}

function showFallback(scene) {
  flat = true;
  fallback.src = scene.fallback;
  fallback.hidden = false;
  canvas.hidden = true;
  if (softwareView) softwareView.hidden = true;
  recenter.hidden = true;
  help.textContent = "Geschilderde reconstructie";
  notice.hidden = true;
  ready = true;
  requestDraw();
}

function imageFor(id) {
  if (!pictures.has(id)) {
    const image = new Image();
    image.src = sceneById[id].picture;
    const pending = image.decode().then(() => image);
    pending.catch(() => pictures.delete(id));
    pictures.set(id, pending);
  }
  return pictures.get(id);
}

async function showScene(id) {
  if (sceneId === id) return;
  sceneId = id;
  const scene = sceneById[id];
  place.textContent = scene.title;
  marker.querySelector("span").textContent = scene.person;
  marker.setAttribute("aria-label", "Praat met " + scene.person);
  for (const button of sceneButtons) button.setAttribute("aria-pressed", String(button.dataset.scene === id));
  marker.hidden = true;
  ready = false;
  look(...scene.direction);
  if (!renderPanorama) {
    showFallback(scene);
    return;
  }

  notice.textContent = "Panorama wordt geladen…";
  notice.hidden = false;
  try {
    const image = await imageFor(id);
    if (sceneId !== id) return;
    renderPanorama.load(image);
  } catch {
    if (sceneId === id) showFallback(scene);
    return;
  }
  flat = false;
  canvas.hidden = false;
  if (softwareView) softwareView.hidden = !usingSoftware;
  fallback.hidden = true;
  recenter.hidden = false;
  help.textContent = "Sleep om rond te kijken · Geschilderde reconstructie";
  notice.hidden = true;
  ready = true;
  requestDraw();
}

function showText(title, text, choices = []) {
  heading.textContent = title;
  speech.textContent = text;
  answers.replaceChildren();
  for (const [label, action] of choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dialog-button";
    button.textContent = label;
    button.addEventListener("click", action);
    answers.append(button);
  }
  if (!dialog.open) dialog.showModal();
  speech.focus();
}

function talk() {
  const id = sceneId;
  const scene = sceneById[id];
  const data = conversations[scene.conversation];
  const show = (text, options) => showText(scene.person, text, options);
  const feedback = (branch, index) => {
    completed.add(id);
    compare.hidden = completed.size !== 2;
    show(data.vervolg[branch].opties[index][1]);
  };
  const followup = branch => {
    const step = data.vervolg[branch];
    show(step.vraag, step.opties.map(([label], index) => [label, () => feedback(branch, index)]));
  };
  const ask = () => show(data.vraag, data.keuzes.map(([label, lines], branch) => [
    label, () => read(lines, "Naar de tegenvraag", () => followup(branch)),
  ]));
  const read = (lines, lastLabel, after, index = 0) => {
    const last = index === lines.length - 1;
    show(lines[index], [[last ? lastLabel : "Lees verder", last ? after : () => read(lines, lastLabel, after, index + 1)]]);
  };
  read(data.verhaal, "Naar de vraag", ask);
}

canvas.addEventListener("pointerdown", event => {
  if (!ready || !event.isPrimary || event.button !== 0) return;
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw, pitch };
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener("pointermove", event => {
  if (drag?.id !== event.pointerId) return;
  const speed = 2 * field / canvas.clientHeight;
  look(drag.yaw - (event.clientX - drag.x) * speed, drag.pitch + (event.clientY - drag.y) * speed);
});
canvas.addEventListener("lostpointercapture", () => { drag = undefined; });
canvas.addEventListener("keydown", event => {
  const movements = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
  const movement = movements[event.key];
  if (!movement) return;
  event.preventDefault();
  look(yaw + movement[0] * 0.11, pitch + movement[1] * 0.11);
});
canvas.addEventListener("webglcontextlost", event => {
  event.preventDefault();
  renderPanorama = createSoftwareRenderer();
  usingSoftware = true;
  reloadScene();
});
canvas.addEventListener("webglcontextrestored", () => {
  try {
    renderPanorama = createRenderer(gl);
    usingSoftware = false;
    reloadScene();
  } catch (error) {
    console.warn(error);
  }
});
function reloadScene() {
  const id = sceneId;
  sceneId = "";
  showScene(id);
}
window.addEventListener("resize", requestDraw);
recenter.addEventListener("click", () => look(...sceneById[sceneId].direction));
marker.addEventListener("click", talk);
for (const button of sceneButtons) button.addEventListener("click", () => showScene(button.dataset.scene));
compare.addEventListener("click", () => showText("Twee plekken, twee verhalen",
  "Wat zag Warnier bij de school? Wat vond de familie Van Hoven in het café? Leg met één detail per plek uit waarom de verhalen verschillen. Gebruik jullie uitleg in het logboek.", [
    ["Naar het museumkaartje", () => showText("Voor jullie WOII-museum",
      "Kies een detail uit jullie logboek. Schets hoe jullie het bezoekers willen laten zien. Leg op het informatiekaartje uit wat er gebeurde, waarom jullie dit verhaal willen doorgeven en welke bron jullie gebruikten.")],
  ]));

// De gesprekken hieronder komen uit de gewone lesgame.
const conversations = {
  "meester": {
    "naam": "De schoolmeester",
    "knop": "de schoolmeester",
    "verhaal": [
      "Ik ben Jef Warnier, de schoolmeester. Mijn gezin woonde bij de school. Toen we buiten schoten hoorden, gingen we naar de kelder.",
      "Beneden hoorden we een harde knal. Pas toen het stiller werd, ging ik naar boven. Ik zag een Duitse soldaat met zijn handen omhoog. Er stond een Amerikaan tegenover hem.",
      "Ik ging naar buiten om hem welkom te heten. Ik zag ook Amerikanen door de heg uit de wei komen. Aan de overkant woonde de familie Van Hoven, bij het café.",
      "Toen een Amerikaanse officier mij vroeg de weg te wijzen, reed ik mee in zijn jeep. Later heb ik mijn belevenissen met potlood opgeschreven."
    ],
    "vraag": "Over welke ontmoeting wil jij meer weten?",
    "keuzes": [
      [
        "Ik wil weten wat u ruilde.",
        [
          "Een Amerikaanse soldaat wilde een flesje inkt. Ik gaf hem inkt van de school. Hij gaf mij een pakje sigaretten van het merk Raleigh.",
          "Ik bewaarde de verpakking en schreef op een briefje hoe ik eraan kwam. Op de verpakking kun je het merk lezen. Het briefje vertelt met wie ik ruilde en wat ik ervoor gaf.",
          "De verpakking en het briefje zijn allebei bewaard gebleven."
        ]
      ],
      [
        "Ik wil weten wie er bleef slapen.",
        [
          "De meeste Amerikanen trokken door de wei naast de school in de richting van de Mescherhei. Eén soldaat bleef achter. We brachten de avond bij kaarslicht door.",
          "We probeerden met elkaar te praten, zo goed als het lukte. Hij sliep in een bed van ons. Mijn gezin ging weer naar de kelder.",
          "De volgende ochtend vertrok hij achter zijn kameraden aan. Bij het afscheid maakte hij op mij een terneergeslagen indruk. Dat schreef ik later op als mijn indruk van hem."
        ]
      ]
    ],
    "vervolg": [
      {
        "vraag": "Stel dat je mijn lege pakje vindt. Hoe kom je erachter wat ik ervoor teruggaf?",
        "opties": [
          [
            "Ik lees het merk op het pakje.",
            "Aan het merk herken je de sigaretten. In mijn briefje staat hoe ik het pakje kreeg en wat ik teruggaf."
          ],
          [
            "Ik lees het briefje over de ruil.",
            "Juist. Daarin schreef ik dat ik inkt van de school gaf. Op het pakje kun je het merk van de sigaretten lezen."
          ]
        ]
      },
      {
        "vraag": "Ik schreef dat hij terneergeslagen leek. Weet je daarmee hoe hij zich voelde?",
        "opties": [
          [
            "Ik weet welke indruk de meester had.",
            "Precies. Ik kon vertellen hoe hij op mij overkwam. Zijn eigen verhaal zou je meer kunnen leren over hoe hij zich voelde."
          ],
          [
            "Ik weet precies hoe de soldaat zich voelde.",
            "In mijn verslag lees je mijn indruk van de soldaat. Als je wilt weten hoe hij zich voelde, helpt het om zijn eigen verhaal te horen."
          ]
        ]
      }
    ]
  },
  "cafeBinnen": {
    "naam": "Een medewerker van het café",
    "knop": "de cafémedewerker",
    "verhaal": [
      "Kijk naar die doeken. Duitse militairen maakten van dit café een tijdelijke plek om gewonden te verzorgen. De familie schuilde beneden.",
      "Toen de Duitsers weg waren, kwam de familie weer boven. In het café lag verband tussen de scharen. Wat kun je uit zo’n vondst afleiden over wat zich boven hun hoofden had afgespeeld?"
    ],
    "vraag": "Wat wil je weten over wat hier is gebeurd?",
    "keuzes": [
      [
        "Wat vertellen de achtergebleven spullen?",
        [
          "Warnier beschreef dat Duitse militairen het café moesten inrichten als noodhospitaal. Het verband en de scharen die bij de schoonmaak werden gevonden, passen bij dat verhaal.",
          "De familie zag de spullen pas na het vertrek van de Duitsers. Aan het verband en de scharen konden ze onmogelijk zien hoeveel mensen er waren verzorgd of wie dat waren."
        ]
      ],
      [
        "Waarom beleefden de buren die dag anders?",
        [
          "Toen het stiller werd, ging schoolmeester Jef Warnier naar boven. Vanaf zijn woning bij de school zag hij dat een Duitse soldaat zich overgaf aan een Amerikaan.",
          "Aan de overkant ontdekte de familie Van Hoven bij het bovenkomen wat de soldaten in het café hadden achtergelaten. Wat je van de bevrijding meekreeg, hing af van waar je was en wanneer je bovenkwam."
        ]
      ]
    ],
    "vervolg": [
      {
        "vraag": "Welk nieuw verhaal helpt je het best om te weten wie hier is verzorgd?",
        "opties": [
          [
            "Een verzorger vertelt wie hij hier hielp.",
            "Een verzorger kon mensen in de kamer zien en zich misschien namen herinneren. Vraag ook hoe hij die namen kende. Zo weet je beter waarop zijn verhaal steunt."
          ],
          [
            "Een buur vertelt wie hij buiten voorbij zag gaan.",
            "Een buur kan je vertellen wie hij op straat zag. Vraag ook of hij iemand het café in zag gaan en of hij weet wat er daarna met die persoon gebeurde."
          ]
        ]
      },
      {
        "vraag": "Warnier zag de overgave. De familie moest opruimen. Hoe horen beide verhalen bij dezelfde bevrijding?",
        "opties": [
          [
            "Ze keken vanaf verschillende plekken en momenten.",
            "Warnier zag de overgave bij de school. De familie zag later binnen wat de Duitsers hadden achtergelaten. Met beide verhalen weet je meer over wat er in de straat gebeurde."
          ],
          [
            "Ze zagen hetzelfde en onthielden andere details.",
            "Mensen kunnen hetzelfde anders onthouden. Hier helpt het om hun plekken op te zoeken. Warnier keek buiten bij de school. De familie ontdekte bij het bovenkomen wat er in het café lag."
          ]
        ]
      }
    ]
  }
};

showScene("school");
