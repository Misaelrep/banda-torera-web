"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { archive, logo, presentMedia } from "@/lib/archivo";
import { buildArchivo, YEAR_STOPS } from "./timeline";
import Atmosphere from "./Atmosphere";
import PresentStage from "./PresentStage";
import Closing from "./Closing";
import s from "./archivo.module.css";

const years = [...archive.map((entry) => entry.year), "PRESENTE"];

export default function ArchivoTorera() {
  const rootRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const goToRef = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    const section = sectionRef.current;
    if (!root || !section) return;

    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia(root);

    mm.add(
      {
        desktop: "(min-width: 761px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 760px) and (prefers-reduced-motion: no-preference)",
        finePointer: "(pointer: fine)",
      },
      (context) => {
        const { desktop, mobile, finePointer } = context.conditions ?? {};
        if (!desktop && !mobile) return;

        const { timeline, cleanup } = buildArchivo(root, section, {
          desktop: Boolean(desktop),
        });

        goToRef.current = (index) => {
          const trigger = timeline.scrollTrigger;
          if (!trigger) return;
          const top =
            trigger.start + ((trigger.end - trigger.start) * YEAR_STOPS[index]) / 100;
          window.scrollTo({ top, behavior: "smooth" });
        };

        // Cursor parallax: every depth layer reads --mx / --my (-1…1).
        let removePointer = () => {};
        if (desktop && finePointer) {
          const pointer = { x: 0, y: 0 };
          const apply = () => {
            root.style.setProperty("--mx", pointer.x.toFixed(4));
            root.style.setProperty("--my", pointer.y.toFixed(4));
          };
          const toX = gsap.quickTo(pointer, "x", { duration: 1.8, ease: "power3.out", onUpdate: apply });
          const toY = gsap.quickTo(pointer, "y", { duration: 1.8, ease: "power3.out", onUpdate: apply });
          const onMove = (event: PointerEvent) => {
            toX((event.clientX / window.innerWidth) * 2 - 1);
            toY((event.clientY / window.innerHeight) * 2 - 1);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          removePointer = () => {
            window.removeEventListener("pointermove", onMove);
            root.style.removeProperty("--mx");
            root.style.removeProperty("--my");
          };
        }

        return () => {
          removePointer();
          cleanup();
          goToRef.current = () => {};
        };
      },
    );

    // Alignment depends on real glyph metrics, so re-measure once fonts land.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
  }, []);

  return (
    <main ref={rootRef} className={s.site}>
      <Atmosphere />

      <section ref={sectionRef} className={s.archive} aria-label="Archivo Torera, 1998 a presente">
        <div className={s.stage} data-a="stage">
          <header className={s.header}>
            <span>VALLE DE AMECA, JALISCO</span>
            <span>ARCHIVO TORERA · 001</span>
          </header>

          <div className={`${s.depth} ${s.depthTorera}`}>
            <h1 className={s.torera} data-a="torera">
              TORERA
            </h1>
          </div>

          <p className={s.kicker} data-a="intro">
            BANDA TORERA DEL VALLE
          </p>
          <div className={s.introFoot} data-a="intro">
            <span>1998</span>
            <span className={s.introLine} />
            <span>PRESENTE</span>
            <span className={s.cue}>DESLIZA PARA RECORRER EL ARCHIVO</span>
          </div>

          <nav className={s.rail} aria-label="Años del archivo" data-a="rail">
            <div className={s.railTrack} data-a="railTrack">
              {years.map((year, index) => (
                <button
                  type="button"
                  key={year}
                  className={s.year}
                  data-a="year"
                  onClick={() => goToRef.current(index)}
                >
                  {year}
                </button>
              ))}
            </div>
          </nav>

          <div className={s.sceneWrap}>
            <div className={s.scene} data-a="scene">
              <span className={s.thread} data-a="thread">
                <span className={s.pulse} data-a="pulse" />
              </span>

              {archive.map((entry, index) => {
                const isLast = index === archive.length - 1;
                return (
                  <figure key={entry.year} className={s.cover} data-a="cover">
                    <Image
                      src={entry.image}
                      alt={`${entry.title}, ${entry.year}`}
                      fill
                      loading="eager"
                      sizes={isLast ? "100vw" : "(max-width: 760px) 80vw, 42vw"}
                      className={s.coverImage}
                    />
                    {isLast && <span className={s.shade} data-a="shade" />}
                    <span className={`${s.corner} ${s.cornerTL}`} />
                    <span className={`${s.corner} ${s.cornerTR}`} />
                    <span className={`${s.corner} ${s.cornerBL}`} />
                    <span className={`${s.corner} ${s.cornerBR}`} />
                    <figcaption className={s.caption} data-a="caption">
                      <span>
                        ARCHIVO {String(index + 1).padStart(2, "0")}/
                        {String(archive.length).padStart(2, "0")}
                      </span>
                      <span className={s.captionYear}>{entry.year}</span>
                      <span className={s.captionTitle}>{entry.title}</span>
                      <span className={s.mono}>
                        {entry.label}
                        {entry.catalog && ` · ${entry.catalog}`}
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>

          <div className={`${s.depth} ${s.depthPresent}`}>
            <div className={s.comp} data-a="comp">
              <span className={s.compGlow} data-a="compGlow" />
              <PresentStage media={presentMedia} className={s.media} />
            </div>
            <div className={s.logo} data-a="logo">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                sizes="(max-width: 760px) 96vw, 90vw"
                className={s.logoImage}
              />
            </div>
            <span className={s.sweep} data-a="sweep" aria-hidden="true" />
          </div>
        </div>
      </section>

      <Closing />
    </main>
  );
}
