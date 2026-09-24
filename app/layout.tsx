import type { Metadata, Viewport } from "next";
import {
  Antonio,
  IBM_Plex_Mono,
  Instrument_Sans,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";

const antonio = Antonio({
  variable: "--font-antonio",
  subsets: ["latin"],
  weight: "700",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Banda Torera del Valle · Archivo Torera",
  description:
    "Banda Torera del Valle. Música regional mexicana del Valle de Ameca, Jalisco, desde 1998. La historia volvió a sonar.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a09",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${antonio.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
