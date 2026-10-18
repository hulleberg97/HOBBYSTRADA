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
const DEPTH = 0.11;
const TEX_W = 600;
const TEX_H = Math.round((TEX_W * CARD_H) / CARD_W);

/** Plastholderen med etikett og kortbilde, tegnet på et lerret som brukes som tekstur. */
function drawFront(ctx: CanvasRenderingContext2D, c: StageCard, img: HTMLImageElement | null) {
  const g = ctx.createLinearGradient(0, 0, TEX_W, TEX_H);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.5, "#dfe5ec");
  g.addColorStop(1, "#f8fafc");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  // Etikett
  ctx.fillStyle = "#fff";
  ctx.fillRect(32, 32, TEX_W - 64, 132);
  ctx.strokeStyle = "#c8102e";
  ctx.lineWidth = 7;
  ctx.strokeRect(32, 32, TEX_W - 64, 132);
  ctx.fillStyle = "#0b1726";
  const fit = (text: string, max: number) => {
    let t = text.toUpperCase();
    while (ctx.measureText(t).width > max && t.length > 3) t = t.slice(0, -2);
    return t === text.toUpperCase() ? t : `${t.trimEnd()}…`;
  };
  ctx.font = "bold 28px Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(fit(c.set, 380), 58, 78);
  ctx.textAlign = "right";
  ctx.fillText(c.number ? `#${c.number}` : "", TEX_W - 58, 78);
  ctx.font = "bold 32px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(fit(c.player, 330), 58, 124);
  ctx.textAlign = "right";
  ctx.fillText(c.type.toUpperCase(), TEX_W - 58, 124);
  // Kortet
  const x = 50;
  const y = 196;
  const w = TEX_W - 100;
  const h = TEX_H - y - 46;
  ctx.fillStyle = "#0d2238";
  ctx.fillRect(x, y, w, h);
  if (img) {
    const s = Math.max(w / img.width, h / img.height);
    const iw = img.width * s;
    const ih = img.height * s;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
    ctx.restore();
  } else {
    ctx.fillStyle = "#f7f3ea";
    ctx.font = "bold 150px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      c.player
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      TEX_W / 2,
      y + h / 2,
    );
  }
}

/** H-symbolet: to kort på skrå med gullstrek. Koordinater i en 100×100-boks. */
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
 * Kortene i ekte 3D: plastholdere med glans og holo-skimmer på gullsokler, i en ring som snurrer sakte
 * over et speilende gulv. Følger musen, kan dras rundt med fingeren og snurrer fortere når man scroller.
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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "pan-y";

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    scene.environment = pmrem.fromScene(room, 0.04).texture;
    scene.environmentIntensity = 0.55;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    const lookAt = new THREE.Vector3(0, 0.55, 0);

    // Studiolys: en spot ovenfra som i en monter, og et svakt gyllent motlys
    const spot = new THREE.SpotLight(0xffffff, 60, 20, Math.PI / 5, 0.6, 1.4);
    spot.position.set(0, 7, 3);
    spot.target.position.set(0, 0, 0);
    scene.add(spot, spot.target);
    const rim = new THREE.DirectionalLight(0xf2d48a, 1.4);
    rim.position.set(-4, 3, -5);
    scene.add(rim, new THREE.AmbientLight(0x8fa4c4, 0.35));

    const disposables: { dispose(): void }[] = [renderer, pmrem, room];
    const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

    const n = Math.max(cards.length, 3);
    const radius = (CARD_W * 1.1) / Math.tan(Math.PI / n) / 2 + 1.1;
    const ring = new THREE.Group();
    const stage = new THREE.Group();
    stage.add(ring);
    scene.add(stage);

    const slabGeo = track(new RoundedBoxGeometry(CARD_W, CARD_H, DEPTH, 4, 0.07));
    const faceGeo = track(new THREE.PlaneGeometry(CARD_W - 0.02, CARD_H - 0.02));
    const standGeo = track(new RoundedBoxGeometry(CARD_W * 0.78, 0.42, 0.62, 4, 0.06));
    const plinthGeo = track(new THREE.CylinderGeometry(0.95, 1.02, 0.08, 48));
    const slabMat = track(new THREE.MeshPhysicalMaterial({ color: 0xe9eef4, roughness: 0.12, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05 }));
    const goldMat = track(new THREE.MeshStandardMaterial({ color: 0xd2ac58, metalness: 1, roughness: 0.26 }));
    const { tex: markTex } = canvasTexture(256, 256, (ctx) => drawMark(ctx, 128, 128, 170, "#7a5a1c", "#f6e3a6"));
    track(markTex);
    const markMat = track(new THREE.MeshStandardMaterial({ map: markTex, transparent: true, metalness: 0.8, roughness: 0.35 }));
    const { tex: backTex } = canvasTexture(TEX_W, TEX_H, (ctx) => {
      const g = ctx.createLinearGradient(0, 0, TEX_W, TEX_H);
      g.addColorStop(0, "#1a2f55");
      g.addColorStop(1, "#0a1424");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, TEX_W, TEX_H);
      drawMark(ctx, TEX_W / 2, TEX_H / 2, 230, "#f7f3ea", "#c9a24a");
    });
    track(backTex);
    const backMat = track(new THREE.MeshPhysicalMaterial({ map: backTex, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1 }));

    const slabs: { mesh: THREE.Group; slug: string; lift: number; phase: number }[] = [];
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
      const frontMat = track(
        new THREE.MeshPhysicalMaterial({
          map: tex,
          roughness: 0.28,
          metalness: 0.05,
          clearcoat: 1,
          clearcoatRoughness: 0.06,
          iridescence: 0.4,
          iridescenceIOR: 1.35,
          iridescenceThicknessRange: [180, 520],
        }),
      );

      const holder = new THREE.Group();
      const card = new THREE.Group();
      const slab = new THREE.Mesh(slabGeo, slabMat);
      const front = new THREE.Mesh(faceGeo, frontMat);
      front.position.z = DEPTH / 2 + 0.002;
      const back = new THREE.Mesh(faceGeo, backMat);
      back.position.z = -DEPTH / 2 - 0.002;
      back.rotation.y = Math.PI;
      card.add(slab, front, back);
      card.position.y = CARD_H / 2 + 0.3;
      card.userData.slug = c.slug;
      for (const m of [slab, front, back]) {
        m.userData.slug = c.slug;
        hit.push(m);
      }

      const stand = new THREE.Mesh(standGeo, goldMat);
      stand.position.y = 0.12;
      const mark = new THREE.Mesh(track(new THREE.PlaneGeometry(0.34, 0.34)), markMat);
      mark.position.set(0, 0.12, 0.312);
      const plinth = new THREE.Mesh(plinthGeo, goldMat);
      plinth.position.y = -0.1;
      plinth.scale.set(0.62, 1, 0.42);
      holder.add(card, stand, mark, plinth);

      const a = (i / n) * Math.PI * 2;
      holder.position.set(Math.sin(a) * radius, 0, Math.cos(a) * radius);
      holder.rotation.y = a;
      ring.add(holder);
      slabs.push({ mesh: card, slug: c.slug, lift: 0, phase: i * 1.3 });
    });

    // Speilende gulv (ikke på mobil – for tungt), og et mørkt slør over som toner speilbildet ut mot kantene
    const floorY = -0.15;
    if (!mobile) {
      const mirror = new Reflector(track(new THREE.CircleGeometry(radius + 4, 64)), {
        textureWidth: Math.min(1024, el.clientWidth),
        textureHeight: Math.min(1024, el.clientWidth),
        color: 0x3a4250,
      });
      mirror.rotation.x = -Math.PI / 2;
      mirror.position.y = floorY;
      scene.add(mirror);
      disposables.push(mirror);
    }
    const { tex: fadeTex } = canvasTexture(512, 512, (ctx) => {
      const g = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
      g.addColorStop(0, mobile ? "rgba(214,178,95,0.28)" : "rgba(9,16,30,0.45)");
      g.addColorStop(0.55, "rgba(9,16,30,0.85)");
      g.addColorStop(1, "rgba(9,16,30,1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 512);
    });
    track(fadeTex);
    const veil = new THREE.Mesh(
      track(new THREE.PlaneGeometry((radius + 4) * 2, (radius + 4) * 2)),
      track(new THREE.MeshBasicMaterial({ map: fadeTex, transparent: true, depthWrite: false })),
    );
    veil.rotation.x = -Math.PI / 2;
    veil.position.y = floorY + 0.004;
    scene.add(veil);

    // Størrelse og kamera: trekk kameraet bakover på smale skjermer så hele ringen får plass
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      const dist = (radius * 2.1 + 3.2) / Math.min(1, camera.aspect * 0.95);
      camera.position.set(0, 2.1, dist);
      camera.lookAt(lookAt);
      camera.updateProjectionMatrix();
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
      tilt.x = pointer.y * 0.06;
      tilt.y = pointer.x * 0.12;
      if (dragging) {
        const dx = e.clientX - lastX;
        moved += Math.abs(dx);
        ring.rotation.y += dx * 0.006;
        velocity = dx * 0.0009;
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
      velocity += (window.scrollY - lastScroll) * 0.00025;
      lastScroll = window.scrollY;
    };
    const c = renderer.domElement;
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    c.addEventListener("pointerleave", onLeave);
    c.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Tegn bare når forsiden er synlig
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
      c.style.cursor = hovered ? "pointer" : dragging ? "grabbing" : "grab";

      if (!dragging) {
        const base = still ? 0 : hovered ? 0 : 0.16;
        ring.rotation.y += (base + velocity * 60) * dt;
        velocity *= 0.94;
      }
      stage.rotation.x += (tilt.x - stage.rotation.x) * 0.06;
      stage.rotation.y += (tilt.y - stage.rotation.y) * 0.06;
      for (const s of slabs) {
        s.lift += ((s.slug === hovered ? 0.22 : 0) - s.lift) * 0.12;
        s.mesh.position.y = CARD_H / 2 + 0.3 + s.lift + (still ? 0 : Math.sin(t * 1.1 + s.phase) * 0.05);
        s.mesh.rotation.z = still ? 0 : Math.sin(t * 0.8 + s.phase) * 0.012;
      }
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      c.removeEventListener("pointermove", onMove);
      c.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      c.removeEventListener("pointerleave", onLeave);
      c.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      scene.environment?.dispose();
      disposables.forEach((d) => d.dispose());
      c.remove();
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
