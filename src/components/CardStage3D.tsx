"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { Reflector } from "three/addons/objects/Reflector.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type StageCard = { slug: string; title: string; image: string | null; set: string; player: string; number: string; type: string };

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

  // Etikett
  const lx = 44;
  const ly = 44;
  const lw = W - 88;
  const lh = 176;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(lx, ly, lw, lh, 10);
  ctx.fill();
  ctx.strokeStyle = "#c8102e";
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.fillStyle = "#0b1726";
  ctx.textBaseline = "middle";
  ctx.font = `600 40px ${fontFamily}`;
  ctx.textAlign = "left";
  ctx.fillText(fit(ctx, c.set, lw - 230), lx + 30, ly + 54);
  ctx.textAlign = "right";
  ctx.fillText(c.number ? `#${c.number}` : "", lx + lw - 30, ly + 56);
  ctx.font = `800 56px ${fontFamily}`;
  ctx.textAlign = "left";
  ctx.fillText(fit(ctx, c.player, lw - 290), lx + 30, ly + 120);
  ctx.textAlign = "right";
  ctx.font = `700 40px ${fontFamily}`;
  ctx.fillText(c.type.toUpperCase(), lx + lw - 30, ly + 120);

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

/**
 * Kortene i ekte 3D: graderte kort i klar plast, på gullsokler, i en ring som snurrer sakte i et mørkt studio
 * med spot ovenfra og speilende gulv. Kortene bak forsvinner i mørket, så kortet foran er i fokus.
 * Følger musen, kan dras rundt med fingeren og snurrer fortere når man scroller.
 */
export function CardStage3D({ cards, fallback }: { cards: StageCard[]; fallback: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const router = useRouter();
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
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "pan-y";

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    scene.environment = pmrem.fromScene(room, 0.03).texture;
    scene.environmentIntensity = 0.5;
    scene.fog = new THREE.Fog(BG, 10, 20);

    const disposables: { dispose(): void }[] = [renderer, pmrem, room];
    const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

    const n = Math.max(cards.length, 3);
    const radius = (CARD_W * 1.25) / Math.tan(Math.PI / n) / 2 + 1.25;
    const ring = new THREE.Group();
    const stage = new THREE.Group();
    stage.add(ring);
    scene.add(stage);

    // Lys: en smal spot rett ovenfra på kortet foran, som i en monter. Resten ligger i halvmørke.
    const front = new THREE.Vector3(0, 0, radius);
    const spot = new THREE.SpotLight(0xfff6e6, 140, 16, Math.PI / 8, 0.75, 1.6);
    spot.position.set(0, 7.5, radius + 0.6);
    spot.target.position.set(0, 1.2, radius);
    const rim = new THREE.DirectionalLight(0xf2d48a, 1.1);
    rim.position.set(-5, 4, -6);
    const fill = new THREE.DirectionalLight(0x9fb4d8, 0.35);
    fill.position.set(4, 2, 8);
    scene.add(spot, spot.target, rim, fill, new THREE.AmbientLight(0x6f84a8, 0.18));

    // Lyskjeglen ovenfra, synlig i lufta som i videoen. Myk mot kantene og nedover.
    const coneMat = track(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { color: { value: new THREE.Color(0xfff1d6) }, strength: { value: 0.22 } },
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
            float edge = pow(abs(dot(vN, vView)), 2.2);
            float fall = smoothstep(0.0, 0.85, vY);
            gl_FragColor = vec4(color, edge * fall * strength);
          }`,
      }),
    );
    const cone = new THREE.Mesh(track(new THREE.CylinderGeometry(0.2, 2.1, 7, 64, 1, true)), coneMat);
    cone.position.set(0, 3.5, radius);
    scene.add(cone);

    // Glass, gull og bakside er felles for alle kortene
    const glassGeo = track(new RoundedBoxGeometry(CARD_W, CARD_H, DEPTH, 5, 0.06));
    const faceGeo = track(new THREE.PlaneGeometry(CARD_W - 0.03, CARD_H - 0.03));
    const glass = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.03,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        transparent: true,
        opacity: 0.16,
        envMapIntensity: 3,
        depthWrite: false,
      }),
    );
    const gold = track(new THREE.MeshStandardMaterial({ color: 0xcfa653, metalness: 1, roughness: 0.2, envMapIntensity: 1.3 }));
    const blockGeo = track(new RoundedBoxGeometry(CARD_W * 0.7, 0.24, 0.34, 5, 0.035));
    const plateGeo = track(new THREE.CylinderGeometry(0.72, 0.76, 0.05, 64));
    const { tex: markTex } = canvasTexture(256, 256, (ctx) => drawMark(ctx, 128, 128, 160, "#6e5019", "#8a6a26"));
    track(markTex);
    const markMat = track(new THREE.MeshStandardMaterial({ map: markTex, transparent: true, metalness: 0.9, roughness: 0.4 }));
    const markGeo = track(new THREE.PlaneGeometry(0.17, 0.17));
    const { tex: backTex } = canvasTexture(TEX_W, TEX_H, drawBack);
    backTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    track(backTex);
    const backMat = track(new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.45 }));
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

    const slabs: { mesh: THREE.Group; slug: string; lift: number; phase: number }[] = [];
    const hit: THREE.Object3D[] = [];
    const anisotropy = renderer.capabilities.getMaxAnisotropy();
    const PLATE_H = 0.05;
    const BLOCK_H = 0.24;
    const cardY = PLATE_H + BLOCK_H - 0.07 + CARD_H / 2;

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
      const back = new THREE.Mesh(faceGeo, backMat);
      back.position.z = -DEPTH / 2 + 0.012;
      back.rotation.y = Math.PI;
      const shell = new THREE.Mesh(glassGeo, glass);
      shell.renderOrder = 2;
      card.add(face, back, shell);
      card.position.y = cardY;
      for (const m of [face, back, shell]) {
        m.userData.slug = c.slug;
        hit.push(m);
      }

      const plate = new THREE.Mesh(plateGeo, gold);
      plate.position.y = PLATE_H / 2;
      plate.scale.z = 0.62;
      const block = new THREE.Mesh(blockGeo, gold);
      block.position.y = PLATE_H + BLOCK_H / 2;
      const mark = new THREE.Mesh(markGeo, markMat);
      mark.position.set(0, PLATE_H + BLOCK_H / 2, 0.172);
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.004;
      holder.add(shadow, plate, block, mark, card);

      const a = (i / n) * Math.PI * 2;
      holder.position.set(Math.sin(a) * radius, 0, Math.cos(a) * radius);
      holder.rotation.y = a;
      ring.add(holder);
      slabs.push({ mesh: card, slug: c.slug, lift: 0, phase: i * 1.3 });
    });

    // Gulv: speil på PC (for tungt på mobil), med et slør som toner ut mot kantene og en lys flekk under spoten
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
    scene.add(veil);
    const { tex: poolTex } = canvasTexture(256, 256, (ctx) => {
      const g = ctx.createRadialGradient(128, 128, 2, 128, 128, 128);
      g.addColorStop(0, "rgba(255,236,190,0.55)");
      g.addColorStop(0.5, "rgba(214,178,95,0.16)");
      g.addColorStop(1, "rgba(214,178,95,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    });
    track(poolTex);
    const pool = new THREE.Mesh(
      track(new THREE.PlaneGeometry(4.2, 2.6)),
      track(new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })),
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0, 0.006, radius);
    scene.add(pool);

    // Kamera: kortet foran i fokus, ringen bak. Trekkes bakover på smale skjermer.
    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
    const target = new THREE.Vector3(0, 1.45, front.z * 0.35);
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      const visH = Math.max(4.9, ((2 * radius + 1.2) / camera.aspect) * 0.92);
      const d = visH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.position.set(0, target.y + 0.75, target.z + d);
      camera.lookAt(target);
      camera.updateProjectionMatrix();
      const fog = scene.fog as THREE.Fog;
      const toFront = camera.position.z - radius;
      fog.near = toFront + 0.6;
      fog.far = toFront + radius * 2.6;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Samhandling: vipp etter musen, dra for å snurre, scroll gir fart, hold over for å løfte kortet
    const pointer = new THREE.Vector2(9, 9);
    const tilt = { x: 0, y: 0 };
    let velocity = 0;
    let dragging = false;
    let lastX = 0;
    let hovered: string | null = null;
    let moved = 0;
    const ray = new THREE.Raycaster();
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      tilt.x = pointer.y * 0.035;
      tilt.y = pointer.x * 0.08;
      if (dragging) {
        const dx = e.clientX - lastX;
        moved += Math.abs(dx);
        ring.rotation.y += dx * 0.005;
        velocity = dx * 0.0008;
        lastX = e.clientX;
      }
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
    };
    const onUp = () => {
      dragging = false;
    };
    const onLeave = () => {
      pointer.set(9, 9);
      tilt.x = tilt.y = 0;
      dragging = false;
    };
    const onClick = () => {
      if (hovered && moved < 6) router.push(`/products/${hovered}`);
    };
    let lastScroll = window.scrollY;
    const onScroll = () => {
      velocity += (window.scrollY - lastScroll) * 0.0002;
      lastScroll = window.scrollY;
    };
    const cv = renderer.domElement;
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    cv.addEventListener("pointerleave", onLeave);
    cv.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Tegn bare når feltet er synlig
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
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

      if (!dragging) {
        const base = still || hovered ? 0 : 0.11;
        ring.rotation.y += (base + velocity * 60) * dt;
        velocity *= 0.94;
      }
      stage.rotation.x += (tilt.x - stage.rotation.x) * 0.05;
      stage.rotation.y += (tilt.y - stage.rotation.y) * 0.05;
      for (const s of slabs) {
        s.lift += ((s.slug === hovered ? 0.16 : 0) - s.lift) * 0.1;
        s.mesh.position.y = cardY + s.lift + (still ? 0 : Math.sin(t * 1.0 + s.phase) * 0.025);
      }
      renderer.render(scene, camera);
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
  // Kantene tones ut, så 3D-feltet glir over i bakgrunnen uten synlige kanter
  return (
    <div
      ref={box}
      style={{
        maskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent), linear-gradient(to bottom, #000 72%, transparent)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
      className="relative h-[340px] w-full sm:h-[440px] lg:h-[500px]"
      aria-label="Utvalgte kort"
      role="img"
    />
  );
}
