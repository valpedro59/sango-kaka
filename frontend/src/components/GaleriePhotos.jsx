import { useState } from "react";
import SafeImage from "./SafeImage";

export default function GaleriePhotos({ images, title }) {
  const [active, setActive] = useState(0);
  const photos = images?.length ? images : images ? [images] : [];

  if (photos.length === 0) {
    return (
      <div className="relative aspect-video max-h-[320px] overflow-hidden rounded-[14px] bg-neutral-100">
        <SafeImage src={null} alt="Pas de photo" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video max-h-[320px] overflow-hidden rounded-[14px] bg-neutral-100">
        <SafeImage
          src={photos[active]}
          alt={`${title} — photo ${active + 1}`}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {photos.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-[10px] border-2 transition ${
                i === active
                  ? "border-brand-500"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <SafeImage src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
