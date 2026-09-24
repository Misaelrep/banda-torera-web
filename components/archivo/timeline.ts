import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { logoInComposition, logoInk, toreraInLogo } from "@/lib/archivo";

gsap.registerPlugin(ScrollTrigger);

// The whole experience is one scrubbed timeline, 100 units long.
// 0–9     opening: TORERA recedes into the background, 1998 emerges
// 9–52    archive: 1998 → 1999 → 2000 → 2001
// 52–66   threshold: 2001 takes the frame, archive fades, TORERA returns
// 66–80   the red line sweeps TORERA into the contemporary logo
// 80–100  PRESENTE: logo lands on the composition, the band rises behind it
const YEAR_SHIFTS: [number, number][] = [
  [16, 22],
  [28, 34],
  [40, 46],
];
// Scroll positions (timeline units) the year buttons jump to.
export const YEAR_STOPS = [11, 25, 37, 49, 96];

type Ink = { left: number; top: number; width: number; height: number };

// Ink box of a single-line text element, in em, relative to its layout box.
// Measured at runtime so the alignment survives a font change.
function inkMetrics(el: HTMLElement): Ink {
  const fallback = { left: 0, top: 0.135, width: 2.58, height: 0.87 };
  const cs = getComputedStyle(el);
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;
  const m = ctx.measureText(el.textContent ?? "");
  if (!m.fontBoundingBoxAscent) return fallback;
  const ascent = m.fontBoundingBoxAscent / 100;
  const descent = m.fontBoundingBoxDescent / 100;
  const lineHeight = parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) || 1;
  const baseline = (lineHeight - (ascent + descent)) / 2 + ascent;
  return {
    left: -m.actualBoundingBoxLeft / 100,
    top: baseline - m.actualBoundingBoxAscent / 100,
    width: (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) / 100,
    height: (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) / 100,
  };
}

export function buildArchivo(
  root: HTMLElement,
  section: HTMLElement,
  { desktop }: { desktop: boolean },
) {
  const one = (name: string) =>
    root.querySelector<HTMLElement>(`[data-a="${name}"]`)!;
  const all = (name: string) =>
    Array.from(root.querySelectorAll<HTMLElement>(`[data-a="${name}"]`));

  const stage = one("stage");
  const torera = one("torera");
  const intro = all("intro");
  const rail = one("rail");
  const railTrack = one("railTrack");
  const years = all("year");
  const scene = one("scene");
  const covers = all("cover");
  const captions = all("caption");
  const thread = one("thread");
  const pulse = one("pulse");
  const shade = one("shade");
  const comp = one("comp");
  const compGlow = one("compGlow");
  const logo = one("logo");
  const sweep = one("sweep");

  const g = {
    W: 0, H: 0, slot: 0, F: 0,
    ink: { left: 0, top: 0, width: 0, height: 0 } as Ink,
    toreraLeft: 0, toreraTop: 0,
    ghostX: 0, ghostY: 0, ghostS: 1, drift: 0,
    alignX: 0, alignY: 0, alignS: 1,
    L: { left: 0, top: 0, w: 0, h: 0 },
    sweepX0: 0, sweepX1: 0, sweepTop: 0,
    logoX: 0, logoY: 0, logoS: 1,
    fillX: 0, fillY: 0, fillS: 1,
    railPos: [] as number[],
  };

  function measure() {
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    g.W = W;
    g.H = H;
    g.slot = scene.offsetWidth;

    // TORERA: layout box (untransformed) and ink.
    g.F = parseFloat(getComputedStyle(torera).fontSize);
    g.ink = inkMetrics(torera);
    g.toreraLeft = torera.offsetLeft;
    g.toreraTop = torera.offsetTop;
    const inkPx = (s: number) => g.F * s;

    // Ghost: huge, cropped past the left edge, vertically centred.
    g.ghostS = desktop ? 1.5 : 1.75;
    g.ghostX = -0.08 * W - g.toreraLeft - g.ink.left * inkPx(g.ghostS);
    g.ghostY =
      0.5 * H - g.toreraTop - (g.ink.top + g.ink.height / 2) * inkPx(g.ghostS);
    g.drift = -0.07 * W;

    // Logo box and the editorial TORERA aligned onto the logo's TORERA.
    const L = {
      left: logo.offsetLeft,
      top: logo.offsetTop,
      w: logo.offsetWidth,
      h: logo.offsetHeight,
    };
    g.L = L;
    g.alignS = (toreraInLogo.width * L.w) / (g.ink.width * g.F);
    const cx = L.left + (toreraInLogo.left + toreraInLogo.width / 2) * L.w;
    const cy = L.top + (toreraInLogo.top + toreraInLogo.height / 2) * L.h;
    g.alignX = cx - g.toreraLeft - (g.ink.left + g.ink.width / 2) * inkPx(g.alignS);
    g.alignY = cy - g.toreraTop - (g.ink.top + g.ink.height / 2) * inkPx(g.alignS);

    g.sweepX0 = L.left + logoInk.left * L.w - 16;
    g.sweepX1 = L.left + logoInk.right * L.w + 16;
    g.sweepTop = L.top + 0.16 * L.h;
    sweep.style.height = `${0.7 * L.h}px`;

    // Where the loose logo must land to sit exactly on the composition's logo.
    const C = {
      left: comp.offsetLeft,
      top: comp.offsetTop,
      w: comp.offsetWidth,
      h: comp.offsetHeight,
    };
    g.logoS = (logoInComposition.width * C.w) / L.w;
    g.logoX = C.left + logoInComposition.left * C.w - L.left;
    g.logoY = C.top + logoInComposition.top * C.h - L.top;

    // 2001 grows from its slot until it owns the frame.
    const slotCx = scene.offsetLeft + g.slot / 2;
    const slotCy = scene.offsetTop + g.slot / 2;
    g.fillS = (Math.max(W, H) / g.slot) * 1.25;
    g.fillX = W / 2 - slotCx;
    g.fillY = H / 2 - slotCy;

    g.railPos = years.map((el) =>
      desktop
        ? -(el.offsetTop + el.offsetHeight / 2)
        : -(el.offsetLeft + el.offsetWidth / 2),
    );

    // Red thread: from beside the active year to the right edge, passing
    // behind the active cover and in front of the receding ones.
    const start = desktop ? rail.offsetLeft + 0.14 * W : 0;
    thread.style.left = `${start - scene.offsetLeft}px`;
    thread.style.width = `${W - start}px`;
  }

  function applySweep(p: number) {
    const x = g.sweepX0 + p * (g.sweepX1 - g.sweepX0);
    gsap.set(sweep, { x });
    const toreraLocal = (x - (g.toreraLeft + g.alignX)) / g.alignS;
    torera.style.clipPath =
      p > 0 ? `inset(-20% 0 -20% ${Math.max(0, toreraLocal)}px)` : "";
    const hidden = Math.min(g.L.w, Math.max(0, g.L.w - (x - g.L.left)));
    logo.style.clipPath = `inset(0 ${hidden}px 0 0)`;
  }

  measure();
  ScrollTrigger.addEventListener("refreshInit", measure);

  // autoAlpha: covers at 0 also get visibility:hidden, so the compositor
  // skips them instead of blending invisible layers every frame.
  const future = () => ({
    autoAlpha: 0,
    x: 0,
    y: 0.32 * g.slot,
    z: 180,
    rotationX: -12,
    rotationY: -6,
  });
  const active = (i: number) => ({
    autoAlpha: 1,
    x: 0,
    y: 0,
    z: 0,
    rotationX: 0,
    rotationY: i % 2 ? 5 : -5,
  });
  const receded = () => ({
    autoAlpha: 0.26,
    x: -0.2 * g.slot,
    y: -0.1 * g.slot,
    z: -460,
    rotationX: 4,
    rotationY: 14,
  });
  const gone = () => ({
    autoAlpha: 0,
    x: -0.3 * g.slot,
    y: -0.18 * g.slot,
    z: -900,
    rotationX: 6,
    rotationY: 18,
  });
  const yearOff = { scale: 0.5, opacity: 0.22, ...(desktop && { filter: "blur(1.2px)" }) };
  const yearOn = { scale: 1, opacity: 1, ...(desktop && { filter: "blur(0px)" }) };
  const railAxis = desktop ? "y" : "x";

  gsap.set(years, yearOff);
  gsap.set(years[0], yearOn);
  gsap.set(thread, { z: -60, scaleX: 0 });
  gsap.set(captions, { opacity: 0 });

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  });

  // Opening.
  tl.to(intro, { opacity: 0, y: -24, duration: 5 }, 0)
    .to(
      torera,
      {
        x: () => g.ghostX,
        y: () => g.ghostY,
        scale: () => g.ghostS,
        opacity: 0.06,
        duration: 9,
        ease: "power2.inOut",
      },
      0,
    )
    .to(torera, { x: () => g.ghostX + g.drift, duration: 43 }, 9)
    .fromTo(rail, { opacity: 0 }, { opacity: 1, duration: 5 }, 3)
    .fromTo(railTrack, { [railAxis]: () => g.railPos[0] }, { [railAxis]: () => g.railPos[0], duration: 1 }, 3)
    .fromTo(covers[0], future(), { ...active(0), duration: 7, ease: "power2.out" }, 2)
    .to(captions[0], { opacity: 1, duration: 3 }, 7)
    .to(thread, { scaleX: 1, duration: 9, ease: "power1.inOut" }, 3)
    .fromTo(pulse, { xPercent: -100 }, { xPercent: 460, duration: 7 }, 6);

  // Archive: each shift retires the active cover, pushes the previous one
  // further back and brings the next year forward.
  YEAR_SHIFTS.forEach(([a, b], k) => {
    const d = b - a;
    const prev = covers[k - 1];
    tl.to(covers[k], { rotationY: k % 2 ? 3 : -3, duration: a - (k ? YEAR_SHIFTS[k - 1][1] : 9) }, k ? YEAR_SHIFTS[k - 1][1] : 9)
      .to(captions[k], { opacity: 0, duration: 2 }, a)
      .to(covers[k], { ...receded(), duration: d, ease: "power2.inOut" }, a)
      .fromTo(covers[k + 1], future(), { ...active(k + 1), duration: d, ease: "power2.out" }, a + 1)
      .to(captions[k + 1], { opacity: 1, duration: 2 }, b - 1)
      .to(railTrack, { [railAxis]: () => g.railPos[k + 1], duration: d, ease: "power2.inOut" }, a)
      .to(years[k], { ...yearOff, duration: d }, a)
      .to(years[k + 1], { ...yearOn, duration: d }, a)
      .to(torera, { opacity: [0.09, 0.13, 0.18][k], duration: d }, a)
      .fromTo(pulse, { xPercent: -100 }, { xPercent: 460, duration: d, immediateRender: false }, a);
    if (prev) tl.to(prev, { ...gone(), duration: d, ease: "power2.in" }, a);
  });

  // Threshold: 2001 squares up, grows past its frame and dims; the archive
  // falls away and TORERA comes forward to meet the logo.
  const last = covers[covers.length - 1];
  tl.to(captions[3], { opacity: 0, duration: 2 }, 50)
    .to(covers[2], { ...gone(), duration: 4 }, 52)
    .to(last, { rotationX: 0, rotationY: 0, duration: 3, ease: "power1.inOut" }, 52)
    .to(
      last,
      { x: () => g.fillX, y: () => g.fillY, scale: () => g.fillS, duration: 8, ease: "power2.in" },
      54,
    )
    .to(shade, { opacity: 0.9, duration: 5 }, 55)
    .to(last, { autoAlpha: 0, duration: 5 }, 61)
    .to(thread, { opacity: 0, duration: 3 }, 52)
    .to(railTrack, { [railAxis]: () => g.railPos[4], duration: 4, ease: "power2.inOut" }, 52)
    .to(years[3], { ...yearOff, duration: 4 }, 52)
    .to(years[4], { ...yearOn, duration: 4 }, 52)
    .to(rail, { opacity: 0, duration: 4 }, 58)
    .to(root, { "--heat": 0.55, duration: 14 }, 54)
    .to(
      torera,
      {
        x: () => g.alignX,
        y: () => g.alignY,
        scale: () => g.alignS,
        opacity: 1,
        duration: 10,
        ease: "power2.inOut",
      },
      56,
    );

  // The red line sweeps: behind it TORERA becomes the contemporary logo.
  const sweepState = { p: 0 };
  tl.fromTo(
    sweep,
    { x: () => g.sweepX0, y: () => g.sweepTop, scaleY: 0, opacity: 1 },
    { scaleY: 1, duration: 2.5, ease: "power2.out" },
    65.5,
  )
    .to(
      sweepState,
      { p: 1, duration: 10, ease: "power1.inOut", onUpdate: () => applySweep(sweepState.p) },
      68,
    )
    .to(sweep, { scaleY: 0, opacity: 0, duration: 2 }, 78)
    .to(root, { "--heat": 1, duration: 12 }, 70);

  // PRESENTE: the logo lands on the composition's own logo, the band rises
  // behind it, and the loose logo hands off without ever doubling.
  tl.to(
    logo,
    { x: () => g.logoX, y: () => g.logoY, scale: () => g.logoS, duration: 6, ease: "power2.inOut" },
    80,
  )
    .fromTo(compGlow, { opacity: 0 }, { opacity: 1, duration: 10 }, 84)
    .fromTo(comp, { "--reveal": 0 }, { "--reveal": 1, duration: 10 }, 85)
    .to(logo, { opacity: 0, duration: 2 }, 91)
    .fromTo(
      comp,
      { scale: 1 },
      {
        scale: 1.03,
        transformOrigin: "50% 60%",
        duration: 7,
        ease: "power1.out",
      },
      93,
    );

  return {
    timeline: tl,
    cleanup() {
      ScrollTrigger.removeEventListener("refreshInit", measure);
      for (const el of [torera, logo, thread, sweep]) {
        el.style.clipPath = "";
        el.style.left = "";
        el.style.width = "";
        el.style.height = "";
      }
    },
  };
}
