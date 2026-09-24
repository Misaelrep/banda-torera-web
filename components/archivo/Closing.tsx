import s from "./archivo.module.css";

export default function Closing() {
  return (
    <section className={s.closing} aria-label="Cierre">
      <p className={s.closingKicker}>BANDA TORERA DEL VALLE</p>
      <p className={s.closingIndex}>1998 — PRESENTE</p>

      <h2 className={s.closingTitle}>La historia volvió a sonar.</h2>

      <a href="#contrataciones" className={s.availability}>
        CONSULTAR DISPONIBILIDAD
        <span aria-hidden="true">↗</span>
      </a>

      <div id="contrataciones" className={s.ending}>
        <span>FIN DEL PROTOTIPO · V2</span>
      </div>
    </section>
  );
}
