import { useState, useEffect } from "react";

const SVG_PAS_DE_PHOTO = (
  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-neutral-100 text-neutral-400">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-16 w-16">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
    </svg>
    <span className="text-sm font-medium">Pas de photo</span>
  </div>
);

export default function SafeImage({ src, alt, className, loading = "lazy" }) {
  const [sourceImage, setSourceImage] = useState(src);
  const [aErreur, setAErreur] = useState(false);

  useEffect(() => {
    setSourceImage(src);
    setAErreur(false);
  }, [src]);

  if (aErreur || !sourceImage) {
    return SVG_PAS_DE_PHOTO;
  }

  return (
    <img
      src={sourceImage}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setAErreur(true)}
    />
  );
}