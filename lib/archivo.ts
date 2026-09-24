export type ArchiveEntry = {
  year: string;
  title: string;
  label: string;
  catalog?: string;
  image: string;
};

export const archive: ArchiveEntry[] = [
  {
    year: "1998",
    title: "Nos Pertenecemos",
    label: "Balboa Records",
    catalog: "333",
    image: "/assets/historico/1998_nos-pertenecemos.jpg",
  },
  {
    year: "1999",
    title: "Africanos al Ataque",
    label: "Balboa Records",
    catalog: "368",
    image: "/assets/historico/1999_africanos-al-ataque.jpg",
  },
  {
    year: "2000",
    title: "No Hay Marcha Atrás",
    label: "Balboa Records",
    catalog: "413",
    image: "/assets/historico/2000_no-hay-marcha-atras.jpg",
  },
  {
    year: "2001",
    title: "Un Corazón No Espera",
    label: "Mayra Music",
    image: "/assets/historico/2001_un-corazon-no-espera.jpg",
  },
];

export const logo = {
  src: "/assets/actual/logo-torera-actual.png",
  width: 1135,
  height: 433,
  alt: "Banda Torera del Valle",
};

// PRESENTE media slot. Swap to { type: "video", src, poster } when the
// stage footage exists; the composition layout stays the same.
export type PresentMedia =
  | { type: "image"; src: string; width: number; height: number; alt: string }
  | { type: "video"; src: string; poster: string; width: number; height: number; alt: string };

export const presentMedia: PresentMedia = {
  type: "image",
  src: "/assets/actual/banda-torera-actual.png",
  width: 3436,
  height: 2000,
  alt: "Banda Torera del Valle hoy. Si nació grande… regresa grande.",
};

// Where the standalone logo sits inside the composition, as fractions of the
// composition box (measured by template matching the two PNGs). Lets the
// loose logo land exactly on the composition's own logo before handing off.
export const logoInComposition = { left: -0.02328, top: 0.37, width: 1.06365 };

// The word TORERA inside the logo image, as fractions of the logo box.
// The editorial TORERA is aligned to this box before the red line sweeps.
export const toreraInLogo = { left: 0.4617, top: 0.2956, width: 0.4564, height: 0.2818 };

// The logo's visible ink inside its (padded) PNG, as fractions of the logo box.
export const logoInk = { left: 0.0388, right: 0.9392 };
