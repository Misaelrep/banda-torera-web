"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const moments = [
  {
    year: "1998",
    title: "Nos Pertenecemos",
    image: "/assets/historico/1998_nos-pertenecemos.jpg",
  },
  {
    year: "1999",
    title: "Africanos al Ataque",
    image: "/assets/historico/1999_africanos-al-ataque.jpg",
  },
  {
    year: "2000",
    title: "No Hay Marcha Atrás",
    image: "/assets/historico/2000_no-hay-marcha-atras.jpg",
  },
  {
    year: "2001",
    title: "Un Corazón No Espera",
    image: "/assets/historico/2001_un-corazon-no-espera.jpg",
  },
  {
    year: "PRESENTE",
    title: "La historia volvió a sonar.",
    image: null,
  },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const artworkRef = useRef<HTMLDivElement>(null);

  const moment = moments[active];

  function handleMouseMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !artworkRef.current) return;

    const rect = artworkRef.current.getBoundingClientRect();
    const position = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width)
    );

    const nextIndex = Math.round(position * (moments.length - 1));
    setActive(nextIndex);
  }

  return (
    <main className="torera-site">
      <section className="archive-hero">
        <header className="archive-header">
          <span>VALLE DE AMECA, JALISCO</span>
          <span>ARCHIVO TORERA · 001</span>
        </header>

        <div className="archive-intro">
          <p className="archive-kicker">BANDA TORERA DEL VALLE</p>

          <h1 className="torera-word">TORERA</h1>

          <div className="archive-years">
            <span>1998</span>
            <span className="years-line" />
            <span>PRESENTE</span>
          </div>
        </div>

        <div className="archive-stage">
          <div className="stage-meta">
            <p className="stage-label">ARCHIVO</p>
            <p className="stage-year">{moment.year}</p>
            <p className="stage-title">{moment.title}</p>
          </div>

          <div
            ref={artworkRef}
            className="artwork-frame"
            onPointerMove={handleMouseMove}
          >
            {moment.image ? (
              <Image
                key={moment.image}
                src={moment.image}
                alt={`${moment.year} — ${moment.title}`}
                fill
                priority
                sizes="(max-width: 768px) 88vw, 52vw"
                className="archive-image"
              />
            ) : (
              <div className="present-placeholder">
                <div className="present-line" />
                <p>2026</p>
                <strong>PRESENTE</strong>
                <span>VIDEO ACTUAL DE LA BANDA</span>
              </div>
            )}

            <div className="artwork-corner corner-top-left" />
            <div className="artwork-corner corner-top-right" />
            <div className="artwork-corner corner-bottom-left" />
            <div className="artwork-corner corner-bottom-right" />
          </div>

          <div className="interaction-note">
            <span className="desktop-note">MUEVE EL CURSOR SOBRE EL ARCHIVO</span>
            <span className="mobile-note">DESLIZA PARA RECORRER EL ARCHIVO</span>
          </div>
        </div>

        <div className="timeline">
          <input
            aria-label="Recorrer archivo histórico de Banda Torera"
            type="range"
            min="0"
            max={moments.length - 1}
            value={active}
            onChange={(event) => setActive(Number(event.target.value))}
          />

          <div className="timeline-labels">
            {moments.map((item, index) => (
              <button
                type="button"
                key={item.year}
                className={active === index ? "active" : ""}
                onClick={() => setActive(index)}
              >
                {item.year}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-closing">
          <p className="closing-index">1998 — PRESENTE</p>

          <h2>La historia volvió a sonar.</h2>

          <p className="closing-copy">
            Banda Torera del Valle vuelve al escenario con una historia que
            comenzó hace más de dos décadas y todavía tiene cosas por decir.
          </p>

          <a href="#contrataciones" className="availability-button">
            CONSULTAR DISPONIBILIDAD
            <span>↗</span>
          </a>
        </div>

        <div id="contrataciones" className="prototype-ending">
          <span>FIN DEL PROTOTIPO · V1</span>
        </div>
      </section>
    </main>
  );
}