import s from "./archivo.module.css";

// Fixed backdrop: diffuse red light drifting slowly, an amber light that
// rises with --heat as the story reaches PRESENTE, vignette and film grain.
export default function Atmosphere() {
  return (
    <div className={s.atmosphere} aria-hidden="true">
      <div className={`${s.lightLayer} ${s.lightFar}`}>
        <span className={`${s.light} ${s.lightRed}`} />
      </div>
      <div className={`${s.lightLayer} ${s.lightNear}`}>
        <span className={`${s.light} ${s.lightDeep}`} />
      </div>
      <div className={`${s.lightLayer} ${s.lightWarm}`}>
        <span className={`${s.light} ${s.lightAmber}`} />
      </div>
      <span className={s.vignette} />
      <span className={s.grain} />
    </div>
  );
}
