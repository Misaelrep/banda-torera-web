import Image from "next/image";
import type { PresentMedia } from "@/lib/archivo";

// Media slot for PRESENTE. Today it renders the transparent composition;
// switching lib/archivo.ts to a video entry renders full stage footage instead.
export default function PresentStage({
  media,
  className,
}: {
  media: PresentMedia;
  className?: string;
}) {
  if (media.type === "video") {
    return (
      <video
        className={className}
        src={media.src}
        poster={media.poster}
        aria-label={media.alt}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return (
    <Image
      className={className}
      src={media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      sizes="(max-width: 760px) 100vw, 94vw"
    />
  );
}
