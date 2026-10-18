"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRightIcon } from "lucide-react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { Reflector } from "three/addons/objects/Reflector.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export type StageCard = {
  slug: string;
  title: string;
  image: string | null;
  set: string;
  player: string;
  number: string;
  type: string;
  price: string;
  /** Gradering, f.eks. «PSA 10». Tom for ugraderte kort. */
  grade: string;
};

const CARD_W = 1.6;
const CARD_H = 2.62;
const DEPTH = 0.1;
const TEX_W = 900;
const TEX_H = Math.round((TEX_W * CARD_H) / CARD_W);
const BG = 0x0b1426;
const BG_RGB = "11,20,38";

let fontFamily = "Arial, sans-serif";

function fit(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const full = text.toUpperCase();
  let t = full;
  while (ctx.measureText(t).width > max && t.length > 3) t = t.slice(0, -1);
  return t === full ? t : `${t.trimEnd()}…`;
}

/** Innsiden av holderen: etikett øverst og kortet i en fordypning. Plasten legges som eget glass utenpå. */
function drawFront(ctx: CanvasRenderingContext2D, c: StageCard, img: HTMLImageElement | null) {
  const W = TEX_W;
  const H = TEX_H;
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#f5f7fa");
  g.addColorStop(0.55, "#dde3ea");
  g.addColorStop(1, "#eef1f5");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Etikett: sett og nummer, spiller og type, strekkode og gradering eller hologram
  const lx = 44;
  const ly = 44;
  const lw = W - 88;
  const lh = 214;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(lx, ly, lw, lh, 10);
  ctx.fill();
  ctx.strokeStyle = "#c8102e";
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.fillStyle = "#0b1726";
  ctx.textBaseline = "middle";
  ctx.font = `600 36px ${fontFamily}`;
  ctx.textAlign = "right";
  const num = c.number ? `#${c.number}` : "";
  ctx.fillText(num, lx + lw - 30, ly + 46);
  ctx.textAlign = "left";
  ctx.fillText(fit(ctx, c.set, lw - 90 - ctx.measureText(num).width), lx + 30, ly + 46);
  ctx.font = `700 36px ${fontFamily}`;
  ctx.textAlign = "right";
  const type = c.type.toUpperCase();
  ctx.fillText(type, lx + lw - 30, ly + 102);
  const room = lw - 90 - ctx.measureText(type).width;
  ctx.font = `800 50px ${fontFamily}`;
  ctx.textAlign = "left";
  ctx.fillText(fit(ctx, c.player, room), lx + 30, ly + 102);
  // Strekkode (pynt)
  let bx = lx + 30;
  for (let i = 0; i < 46; i++) {
    const w = 1 + ((i * 7) % 4);
    ctx.fillRect(bx, ly + 150, w, 38);
    bx += w + 2 + ((i * 3) % 3);
  }
  // Gradering, eller hologramstripe for ugraderte
  if (c.grade) {
    ctx.fillStyle = "#c8102e";
    ctx.font = `800 52px ${fontFamily}`;
    ctx.textAlign = "right";
    ctx.fillText(c.grade.toUpperCase(), lx + lw - 30, ly + 168);
  } else {
    const hg = ctx.createLinearGradient(lx + lw - 210, 0, lx + lw - 30, 0);
    ["#7cf7ff", "#b58cff", "#ff8fd0", "#ffd36e", "#7cf7ff"].forEach((col, i) => hg.addColorStop(i / 4, col));
    ctx.fillStyle = hg;
    ctx.beginPath();
    ctx.roundRect(lx + lw - 210, ly + 150, 180, 38, 6);
    ctx.fill();
  }

  // Fordypningen og kortet
  const wx = 70;
  const wy = ly + lh + 44;
  const ww = W - 140;
  const wh = H - wy - 70;
  ctx.fillStyle = "#c3ccd6";
  ctx.beginPath();
  ctx.roundRect(wx - 10, wy - 10, ww + 20, wh + 20, 14);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(wx, wy, ww, wh);
  const x = wx + 12;
  const y = wy + 12;
  const w = ww - 24;
  const h = wh - 24;
  ctx.fillStyle = "#0d2238";
  ctx.fillRect(x, y, w, h);
  if (img) {
    const s = Math.max(w / img.width, h / img.height);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.drawImage(img, x + (w - img.width * s) / 2, y + (h - img.height * s) / 2, img.width * s, img.height * s);
    ctx.restore();
  } else {
    ctx.fillStyle = "#f7f3ea";
    ctx.font = `800 220px ${fontFamily}`;
    ctx.textAlign = "center";
    const initials = c.player
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    ctx.fillText(initials, W / 2, y + h / 2);
  }
}

/** H-symbolet: to kort på skrå med gullstrek. */
function drawMark(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, cards: string, bar: string) {
  const k = size / 76;
  const card = (x: number, rot: number) => {
    ctx.save();
    ctx.translate(cx + (x + 14 - 50) * k, cy);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.fillStyle = cards;
    ctx.beginPath();
    ctx.roundRect(-14 * k, -38 * k, 28 * k, 76 * k, 7 * k);
    ctx.fill();
    ctx.restore();
  };
  card(17, -7);
  card(55, 7);
  ctx.fillStyle = bar;
  ctx.beginPath();
  ctx.roundRect(cx - 17 * k, cy - 7 * k, 34 * k, 14 * k, 3 * k);
  ctx.fill();
}

/** Baksiden: mørk etikett, tynn gullramme og et lite H-merke. */
function drawBack(ctx: CanvasRenderingContext2D) {
  const W = TEX_W;
  const H = TEX_H;
  ctx.fillStyle = "#e4e9ef";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#0f1f39";
  ctx.beginPath();
  ctx.roundRect(44, 44, W - 88, 176, 10);
  ctx.fill();
  drawMark(ctx, W / 2, 132, 110, "#f7f3ea", "#c9a24a");
  const g = ctx.createLinearGradient(0, 260, W, H);
  g.addColorStop(0, "#162a4c");
  g.addColorStop(1, "#0a1424");
  ctx.fillStyle = g;
  ctx.fillRect(60, 260, W - 120, H - 330);
  ctx.strokeStyle = "#c9a24a";
  ctx.lineWidth = 4;
  ctx.strokeRect(90, 290, W - 180, H - 390);
  drawMark(ctx, W / 2, 260 + (H - 330) / 2, 150, "rgba(201,162,74,.85)", "#f2dc9b");
}

function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  draw(ctx);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, ctx };
}

let webglCache: boolean | undefined;
function webglOk() {
  if (webglCache !== undefined) return webglCache;
  try {
    const c = document.createElement("canvas");
    webglCache = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

/** Myk, synlig lyskjegle: toner ut mot kantene og nedover. */
function lightCone(top: number, bottom: number, height: number, strength: number) {
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { color: { value: new THREE.Color(0xfff1d6) }, strength: { value: strength } },
    vertexShader: `
      varying float vY; varying vec3 vN; varying vec3 vView;
      void main() {
        vY = uv.y;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 color; uniform float strength;
      varying float vY; varying vec3 vN; varying vec3 vView;
      void main() {
        float edge = pow(abs(dot(vN, vView)), 2.4);
        float fall = smoothstep(0.0, 0.9, vY);
        gl_FragColor = vec4(color, edge * fall * strength);
      }`,
  });
  return new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, 48, 1, true), mat);
}

const DWELL = 3.4; // sekunder hvert kort står i fokus
const TURN = 1.4; // sekunder på å snu til neste

/**
 * Kortene i ekte 3D, i bane rundt en sokkel i midten. Et lysrigg med flomlys over ringen lyser opp kortene
 * når de passerer, og kortet som kommer foran stopper, løftes frem og får fullt lys. Navn og pris vises under.
 * Hold over for å stoppe, dra for å snurre selv, trykk for å åpne annonsen.
 */
export function CardStage3D({ cards, fallback }: { cards: StageCard[]; fallback: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [focus, setFocus] = useState(0);
  const supported = useSyncExternalStore(
    () => () => {},
    webglOk,
    () => true,
  );

  useEffect(() => {
    const el = box.current;
    if (!el || !cards.length || !supported) return;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    fontFamily = getComputedStyle(document.body).fontFamily || fontFamily;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "pan-y";
    const rich = !mobile; // skygger, glød og speil bare på PC
    if (rich) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    const scene = new THREE.Scene();
    if (rich) scene.background = new THREE.Color(BG);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    scene.environment = pmrem.fromScene(room, 0.03).texture;
    scene.environmentIntensity = 0.4;
    scene.fog = new THREE.Fog(BG, 10, 20);

    const disposables: { dispose(): void }[] = [renderer, pmrem, room];
    const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

    const n = Math.max(cards.length, 3);
    const step = (Math.PI * 2) / n;
    const radius = Math.max(3.3, (CARD_W * 1.3) / Math.tan(Math.PI / n) / 2 + 1.2);
    const ring = new THREE.Group();
    const stage = new THREE.Group();
    stage.add(ring);
    scene.add(stage);

    // ── Sokkelen i midten: sort lakk med gullkant, H-merket i gull og en glødende ring rundt
    const black = track(new THREE.MeshPhysicalMaterial({ color: 0x0a0f18, metalness: 0.6, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 }));
    // Børstet gull: fine, vannrette striper i ruheten
    const { tex: brush } = canvasTexture(256, 256, (ctx) => {
      ctx.fillStyle = "#9a9a9a";
      ctx.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 256; y++) {
        const v = 120 + Math.floor(Math.random() * 110);
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.fillRect(0, y, 256, 1);
      }
    });
    brush.colorSpace = THREE.NoColorSpace;
    brush.wrapS = brush.wrapT = THREE.RepeatWrapping;
    brush.repeat.set(2, 6);
    track(brush);
    const gold = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xcfa653,
        metalness: 1,
        roughness: 0.38,
        roughnessMap: brush,
        clearcoat: 0.4,
        clearcoatRoughness: 0.15,
        envMapIntensity: 1.4,
      }),
    );
    const podR = radius * 0.5;
    const podium = new THREE.Mesh(track(new THREE.CylinderGeometry(podR, podR * 1.04, 0.42, 96)), black);
    podium.position.y = 0.21;
    podium.castShadow = podium.receiveShadow = true;
    // Øverste trinn med eget gullinnlegg
    const tierR = podR * 0.8;
    const tier = new THREE.Mesh(track(new THREE.CylinderGeometry(tierR, tierR, 0.12, 96)), black);
    tier.position.y = 0.48;
    tier.castShadow = tier.receiveShadow = true;
    const tierRim = new THREE.Mesh(track(new THREE.TorusGeometry(tierR + 0.004, 0.016, 16, 128)), gold);
    tierRim.rotation.x = Math.PI / 2;
    tierRim.position.y = 0.54;
    const inlay = new THREE.Mesh(track(new THREE.RingGeometry(podR * 0.86, podR * 0.875, 128)), gold);
    inlay.rotation.x = -Math.PI / 2;
    inlay.position.y = 0.4215;
    const rim = new THREE.Mesh(track(new THREE.TorusGeometry(podR + 0.01, 0.022, 16, 128)), gold);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.42;
    const rimLow = new THREE.Mesh(track(new THREE.TorusGeometry(podR * 1.04 + 0.01, 0.018, 16, 128)), gold);
    rimLow.rotation.x = Math.PI / 2;
    rimLow.position.y = 0.01;
    const { tex: topTex } = canvasTexture(1024, 1024, (ctx) => {
      const g = ctx.createRadialGradient(512, 512, 40, 512, 512, 512);
      g.addColorStop(0, "#1b2740");
      g.addColorStop(1, "#070b12");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(512, 512, 512, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(207,166,83,.55)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(512, 512, 430, 0, Math.PI * 2);
      ctx.stroke();
      drawMark(ctx, 512, 512, 380, "#d6b25f", "#f6e3a6");
    });
    track(topTex);
    const top = new THREE.Mesh(
      track(new THREE.CircleGeometry(tierR - 0.004, 96)),
      track(new THREE.MeshPhysicalMaterial({ map: topTex, metalness: 0.5, roughness: 0.3, clearcoat: 1 })),
    );
    top.rotation.x = -Math.PI / 2;
    top.position.y = 0.5415;
    top.receiveShadow = true;
    const glowRing = new THREE.Mesh(
      track(new THREE.RingGeometry(podR * 1.08, podR * 1.16, 128)),
      track(new THREE.MeshBasicMaterial({ color: 0xe9c46a, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    glowRing.rotation.x = -Math.PI / 2;
    glowRing.position.y = 0.006;
    (glowRing.material as THREE.MeshBasicMaterial).color.multiplyScalar(rich ? 2.2 : 1);
    scene.add(podium, rim, rimLow, tier, tierRim, inlay, top, glowRing);

    // ── Lysriggen: en ring av flomlys over banen, som peker ned på kortene
    const RIG_Y = 6.2;
    const rigLights = mobile ? 4 : 8;
    const housingMat = track(new THREE.MeshStandardMaterial({ color: 0x1b2230, metalness: 0.85, roughness: 0.35 }));
    const housingGeo = track(new THREE.CylinderGeometry(0.15, 0.19, 0.26, 32, 1, true));
    housingGeo.rotateX(Math.PI / 2);
    const backCapGeo = track(new THREE.CircleGeometry(0.15, 32));
    const lensGeo = track(new THREE.CircleGeometry(0.165, 32));
    const lensMat = track(new THREE.MeshBasicMaterial({ color: new THREE.Color(0xfff1d6).multiplyScalar(rich ? 6 : 1.2), toneMapped: !rich, fog: false }));
    const rigFrame = new THREE.Mesh(
      track(new THREE.TorusGeometry(radius, 0.03, 8, 128)),
      track(new THREE.MeshStandardMaterial({ color: 0x1a2232, metalness: 0.8, roughness: 0.4 })),
    );
    rigFrame.rotation.x = Math.PI / 2;
    rigFrame.position.y = RIG_Y + 0.06;
    scene.add(rigFrame);
    for (let i = 0; i < rigLights; i++) {
      const a = (i / rigLights) * Math.PI * 2 + Math.PI / rigLights;
      const x = Math.sin(a) * radius;
      const z = Math.cos(a) * radius;
      // Lampehus som peker ned på banen, med lysende linse
      const lamp = new THREE.Group();
      const housing = new THREE.Mesh(housingGeo, housingMat);
      const cap = new THREE.Mesh(backCapGeo, housingMat);
      cap.position.z = -0.13;
      cap.rotation.y = Math.PI;
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.position.z = 0.11;
      lamp.add(housing, cap, lens);
      lamp.position.set(x, RIG_Y, z);
      lamp.lookAt(x * 0.92, 1.2, z * 0.92);
      const light = new THREE.SpotLight(0xfff1d6, rich ? 20 : 26, 14, Math.PI / 7, 0.8, 1.5);
      light.position.set(x, RIG_Y, z);
      light.target.position.set(x * 0.92, 1.2, z * 0.92);
      const cone = lightCone(0.12, 1.25, RIG_Y - 0.2, rich ? 0.022 : 0.06);
      cone.position.set(x * 0.96, RIG_Y / 2, z * 0.96);
      track(cone.geometry);
      track(cone.material as THREE.Material);
      scene.add(lamp, light, light.target, cone);
    }

    // ── Fokuslyset: en sterk spot på plassen foran
    const front = new THREE.Vector3(0, 0, radius);
    const key = new THREE.SpotLight(0xfff6e6, rich ? 70 : 90, 16, Math.PI / 9, 0.7, 1.6);
    key.position.set(0, 7.2, radius + 1.2);
    key.target.position.set(0, 1.3, radius);
    if (rich) {
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.bias = -0.0004;
      key.shadow.normalBias = 0.02;
      key.shadow.radius = 5;
      key.shadow.camera.near = 2;
      key.shadow.camera.far = 14;
    }
    const keyCone = lightCone(0.2, 1.7, 7, rich ? 0.075 : 0.16);
    keyCone.position.set(0, 3.5, radius + 0.15);
    track(keyCone.geometry);
    track(keyCone.material as THREE.Material);
    const back = new THREE.DirectionalLight(0xf2d48a, rich ? 0.5 : 0.9);
    back.position.set(0, 4, -8);
    scene.add(key, key.target, keyCone, back, new THREE.AmbientLight(0x6f84a8, 0.14));

    // ── Kortene
    const glassGeo = track(new RoundedBoxGeometry(CARD_W, CARD_H, DEPTH, 5, 0.06));
    const faceGeo = track(new THREE.PlaneGeometry(CARD_W - 0.03, CARD_H - 0.03));
    const glass = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.03,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        transparent: true,
        opacity: 0.09,
        envMapIntensity: 2.4,
        depthWrite: false,
      }),
    );
    const blockGeo = track(new RoundedBoxGeometry(CARD_W * 0.7, 0.24, 0.34, 5, 0.035));
    const plateGeo = track(new THREE.CylinderGeometry(0.72, 0.76, 0.05, 64));
    const { tex: markTex } = canvasTexture(256, 256, (ctx) => drawMark(ctx, 128, 128, 160, "#6e5019", "#8a6a26"));
    track(markTex);
    const markMat = track(new THREE.MeshStandardMaterial({ map: markTex, transparent: true, metalness: 0.9, roughness: 0.4 }));
    const markGeo = track(new THREE.PlaneGeometry(0.17, 0.17));
    const { tex: backTex } = canvasTexture(TEX_W, TEX_H, drawBack);
    backTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    track(backTex);
    const backMat = track(new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.5, color: 0x9aa4b4 }));
    const { tex: shadowTex } = canvasTexture(128, 128, (ctx) => {
      const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
      g.addColorStop(0, "rgba(0,0,0,0.65)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    });
    track(shadowTex);
    const shadowMat = track(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    const shadowGeo = track(new THREE.PlaneGeometry(2.2, 1.4));

    const PLATE_H = 0.05;
    const BLOCK_H = 0.24;
    const cardY = PLATE_H + BLOCK_H - 0.07 + CARD_H / 2;
    const items: {
      holder: THREE.Group;
      card: THREE.Group;
      face: THREE.MeshPhysicalMaterial;
      glare: THREE.MeshBasicMaterial;
      slug: string;
      angle: number;
      lift: number;
      sweep: number;
    }[] = [];
    // Diagonal lysstripe som flyttes over kortet
    const { tex: glareTex } = canvasTexture(512, 512, (ctx) => {
      ctx.translate(256, 256);
      ctx.rotate(-0.5);
      const g = ctx.createLinearGradient(-90, 0, 90, 0);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.5, "rgba(255,250,235,0.9)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(-90, -600, 180, 1200);
    });
    track(glareTex);
    const hit: THREE.Object3D[] = [];
    const anisotropy = renderer.capabilities.getMaxAnisotropy();

    cards.forEach((c, i) => {
      const { tex, ctx } = canvasTexture(TEX_W, TEX_H, (cx) => drawFront(cx, c, null));
      tex.anisotropy = anisotropy;
      track(tex);
      if (c.image) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          drawFront(ctx, c, img);
          tex.needsUpdate = true;
        };
        img.src = c.image;
      }
      const faceMat = track(
        new THREE.MeshPhysicalMaterial({
          map: tex,
          roughness: 0.42,
          metalness: 0.08,
          iridescence: 0.3,
          iridescenceIOR: 1.3,
          iridescenceThicknessRange: [160, 480],
        }),
      );
      const holder = new THREE.Group();
      const card = new THREE.Group();
      const face = new THREE.Mesh(faceGeo, faceMat);
      face.position.z = DEPTH / 2 - 0.012;
      const backFace = new THREE.Mesh(faceGeo, backMat);
      backFace.position.z = -DEPTH / 2 + 0.012;
      backFace.rotation.y = Math.PI;
      face.castShadow = backFace.castShadow = true;
      // Lysglimtet som glir over kortet når det kommer frem
      const glareMap = track(glareTex.clone());
      glareMap.needsUpdate = true;
      const glareMat = track(
        new THREE.MeshBasicMaterial({ map: glareMap, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }),
      );
      const glare = new THREE.Mesh(faceGeo, glareMat);
      glare.position.z = DEPTH / 2 - 0.006;
      const shell = new THREE.Mesh(glassGeo, glass);
      shell.renderOrder = 2;
      card.add(face, backFace, glare, shell);
      card.position.y = cardY;
      for (const m of [face, backFace, shell]) {
        m.userData.slug = c.slug;
        hit.push(m);
      }
      const plate = new THREE.Mesh(plateGeo, gold);
      plate.castShadow = plate.receiveShadow = true;
      plate.position.y = PLATE_H / 2;
      plate.scale.z = 0.62;
      const block = new THREE.Mesh(blockGeo, gold);
      block.castShadow = block.receiveShadow = true;
      block.position.y = PLATE_H + BLOCK_H / 2;
      const mark = new THREE.Mesh(markGeo, markMat);
      mark.position.set(0, PLATE_H + BLOCK_H / 2, 0.172);
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.004;
      holder.add(shadow, plate, block, mark, card);
      const a = i * step;
      holder.position.set(Math.sin(a) * radius, 0, Math.cos(a) * radius);
      holder.rotation.y = a;
      ring.add(holder);
      items.push({ holder, card, face: faceMat, glare: glareMat, slug: c.slug, angle: a, lift: 0, sweep: 1 });
    });

    // ── Gulv: speil på PC, slør som toner ut, og lys under fokusplassen
    if (!mobile) {
      const mirror = new Reflector(track(new THREE.CircleGeometry(radius + 6, 64)), {
        textureWidth: Math.min(1024, el.clientWidth),
        textureHeight: Math.min(1024, el.clientWidth),
        color: 0x2c3442,
      });
      mirror.rotation.x = -Math.PI / 2;
      mirror.position.y = -0.002;
      scene.add(mirror);
      disposables.push(mirror);
    }
    const { tex: veilTex } = canvasTexture(512, 512, (ctx) => {
      const g = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
      g.addColorStop(0, `rgba(${BG_RGB},${mobile ? 0.9 : 0.55})`);
      g.addColorStop(0.3, `rgba(${BG_RGB},0.85)`);
      g.addColorStop(0.6, `rgba(${BG_RGB},1)`);
      g.addColorStop(1, `rgba(${BG_RGB},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 512);
    });
    track(veilTex);
    const veil = new THREE.Mesh(
      track(new THREE.PlaneGeometry((radius + 6) * 3.4, (radius + 6) * 3.4)),
      track(new THREE.MeshBasicMaterial({ map: veilTex, transparent: true, depthWrite: false, fog: false })),
    );
    veil.rotation.x = -Math.PI / 2;
    veil.position.y = 0.001;
    const { tex: poolTex } = canvasTexture(256, 256, (ctx) => {
      const g = ctx.createRadialGradient(128, 128, 2, 128, 128, 128);
      g.addColorStop(0, "rgba(255,236,190,0.6)");
      g.addColorStop(0.5, "rgba(214,178,95,0.18)");
      g.addColorStop(1, "rgba(214,178,95,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    });
    track(poolTex);
    const pool = new THREE.Mesh(
      track(new THREE.PlaneGeometry(4.4, 2.8)),
      track(new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })),
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0, 0.007, radius);
    scene.add(veil, pool);
    if (rich) {
      const catcher = new THREE.Mesh(track(new THREE.PlaneGeometry(radius * 4, radius * 4)), track(new THREE.ShadowMaterial({ opacity: 0.55 })));
      catcher.rotation.x = -Math.PI / 2;
      catcher.position.y = 0.008;
      catcher.receiveShadow = true;
      scene.add(catcher);
    }

    // Støv som svever i lysstrålene
    const DUST = rich ? 420 : 120;
    const dustPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      const r = Math.sqrt(Math.random()) * 1.7;
      const a = Math.random() * Math.PI * 2;
      dustPos[i * 3] = Math.cos(a) * r;
      dustPos[i * 3 + 1] = 0.3 + Math.random() * 6;
      dustPos[i * 3 + 2] = radius + Math.sin(a) * r;
    }
    const dustGeo = track(new THREE.BufferGeometry());
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const { tex: dotTex } = canvasTexture(64, 64, (ctx) => {
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,244,220,1)");
      g.addColorStop(1, "rgba(255,244,220,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    });
    track(dotTex);
    const dust = new THREE.Points(
      dustGeo,
      track(
        new THREE.PointsMaterial({
          size: 0.035,
          map: dotTex,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          fog: false,
        }),
      ),
    );
    scene.add(dust);

    // Glød rundt lys og gullkanter (bare på PC)
    let composer: EffectComposer | null = null;
    let bloom: UnrealBloomPass | null = null;
    if (rich) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      bloom = new UnrealBloomPass(new THREE.Vector2(el.clientWidth, el.clientHeight), 0.35, 0.3, 1.7);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());
      disposables.push(composer, bloom);
    }

    // ── Kamera: litt ovenfra, så sokkelen og banen synes, med kortet foran i fokus
    const target = new THREE.Vector3(0, 1.35, front.z * 0.42);
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      composer?.setPixelRatio(renderer.getPixelRatio());
      composer?.setSize(w, h);
      camera.aspect = w / h;
      const visH = Math.max(5.6, ((2 * radius + 1.2) / camera.aspect) * 0.86);
      const d = visH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.position.set(0, target.y + d * 0.28, target.z + d);
      camera.lookAt(target);
      camera.updateProjectionMatrix();
      const fog = scene.fog as THREE.Fog;
      const toFront = camera.position.distanceTo(front);
      fog.near = toFront + 0.8;
      fog.far = toFront + radius * 3;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // ── Bevegelse: kortene snur seg frem ett og ett. Hold over stopper, dra snurrer, scroll går videre.
    let index = 0; // kortet som står i fokus
    let shown = -1;
    let angle = 0; // ringens vinkel
    let from = 0;
    let goal = 0;
    let turning = 0; // 0–1 mens ringen snur
    let timer = 0;
    const turnTo = (i: number) => {
      index = i;
      from = angle;
      goal = -i * step;
      turning = 0.0001;
    };
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const pointer = new THREE.Vector2(9, 9);
    const tilt = { x: 0, y: 0 };
    let dragging = false;
    let lastX = 0;
    let moved = 0;
    let hovered: string | null = null;
    const ray = new THREE.Raycaster();
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      tilt.x = pointer.y * 0.03;
      tilt.y = pointer.x * 0.07;
      if (dragging) {
        const dx = e.clientX - lastX;
        moved += Math.abs(dx);
        angle += dx * 0.005;
        lastX = e.clientX;
      }
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      turning = 0;
      moved = 0;
      lastX = e.clientX;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      turnTo(Math.round(-angle / step));
      timer = 0;
    };
    const onLeave = () => {
      pointer.set(9, 9);
      tilt.x = tilt.y = 0;
      onUp();
    };
    const onClick = () => {
      if (hovered && moved < 6) router.push(`/products/${hovered}`);
    };
    let scrolled = 0;
    let lastScroll = window.scrollY;
    const onScroll = () => {
      scrolled += window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      if (Math.abs(scrolled) > 160 && !turning) {
        turnTo(index + Math.sign(scrolled));
        scrolled = 0;
        timer = 0;
      }
    };
    const cv = renderer.domElement;
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    cv.addEventListener("pointerleave", onLeave);
    cv.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    const white = new THREE.Color(0xffffff);
    const dim = new THREE.Color(0x5b6578);
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible) return;
      const t = clock.elapsedTime;

      ray.setFromCamera(pointer, camera);
      const h = ray.intersectObjects(hit, false)[0];
      hovered = (h?.object.userData.slug as string) ?? null;
      cv.style.cursor = hovered ? "pointer" : dragging ? "grabbing" : "grab";

      if (turning > 0) {
        turning = Math.min(1, turning + dt / TURN);
        angle = from + (goal - from) * ease(turning);
        if (turning >= 1) turning = 0;
      } else if (!dragging && !hovered && !still) {
        timer += dt;
        if (timer > DWELL) {
          timer = 0;
          turnTo(index + 1);
        }
      }
      ring.rotation.y = angle;
      stage.rotation.x += (tilt.x - stage.rotation.x) * 0.05;
      stage.rotation.y += (tilt.y - stage.rotation.y) * 0.05;
      podium.rotation.y = top.rotation.z = -angle * 0.25;

      // Fokus: kortet nærmest fronten løftes frem, blir større og får fullt lys
      let best = 0;
      let bestF = -2;
      items.forEach((it, i) => {
        const f = Math.cos(it.angle + angle);
        if (f > bestF) {
          bestF = f;
          best = i;
        }
        const k = Math.pow(Math.max(0, f), 6);
        it.lift += ((it.slug === hovered ? 0.14 : 0) - it.lift) * 0.1;
        it.card.position.y = cardY + it.lift + k * 0.12 + (still ? 0 : Math.sin(t + i * 1.3) * 0.02);
        it.card.position.z = k * 0.35;
        it.card.scale.setScalar(1 + k * 0.1);
        it.face.color.copy(dim).lerp(white, 0.35 + 0.65 * Math.max(0, f));
        // Lysglimt: starter når kortet når fronten, glir over på ett sekund
        if (f > 0.97 && it.sweep >= 1 && turning === 0 && !dragging) it.sweep = 0;
        if (f < 0.5) it.sweep = 1;
        if (it.sweep < 1) it.sweep = Math.min(1, it.sweep + dt / 1.1);
        it.glare.opacity = it.sweep < 1 ? Math.sin(it.sweep * Math.PI) * 0.22 : 0;
        (it.glare.map as THREE.Texture).offset.x = 0.9 - it.sweep * 1.8;
      });
      if (best !== shown && bestF > 0.92) {
        shown = best;
        setFocus(best);
      }
      dust.rotation.y = t * 0.01;
      dust.position.y = Math.sin(t * 0.2) * 0.08;
      if (composer) composer.render();
      else renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointerleave", onLeave);
      cv.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      scene.environment?.dispose();
      disposables.forEach((d) => d.dispose());
      cv.remove();
    };
  }, [cards, router, supported]);

  if (!supported) return <>{fallback}</>;
  const c = cards[focus] ?? cards[0];
  return (
    <div className="relative">
      {/* Kantene tones ut, så 3D-feltet glir over i bakgrunnen uten synlige kanter */}
      <div
        ref={box}
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent), linear-gradient(to bottom, transparent, #000 8%, #000 80%, transparent)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
        className="relative h-[380px] w-full sm:h-[480px] lg:h-[540px]"
        aria-label="Utvalgte kort"
        role="img"
      />
      {c && (
        <div key={c.slug} className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-4 sm:bottom-5">
          <Link
            href={`/products/${c.slug}`}
            className="pointer-events-auto flex animate-[stage-in_.6s_ease-out] items-center gap-4 rounded-full bg-black/45 py-2 pl-5 pr-2 text-left text-white ring-1 ring-inset ring-[#cfa653]/40 backdrop-blur-md"
          >
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold leading-tight sm:text-sm">{c.player}</span>
              <span className="block truncate text-[11px] text-white/60 sm:text-xs">{c.set}</span>
            </span>
            <span className="shrink-0 font-heading text-sm font-semibold text-[#f2dc9b] sm:text-base">{c.price}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#cfa653] text-[#0b1426]">
              <ArrowRightIcon className="h-4 w-4" aria-label="Se kortet" />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
