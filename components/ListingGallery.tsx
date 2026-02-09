"use client";

import { useState } from "react";
import Image from "next/image";

type MediaItem = {
  type: "image" | "video";
  src: string;
};

export default function ListingGallery({
  images,
}: {
  images: string[];
}) {
  const media: MediaItem[] = normalizeMedia(images);

  const [activeIndex, setActiveIndex] = useState(0);

  const total = media.length;
  const maxThumbs = 4;
  const visibleThumbs = media.slice(0, maxThumbs);
  const remaining = total - maxThumbs;

  const activeItem = media[activeIndex];

  const next = () =>
    setActiveIndex((i) => (i + 1) % total);

  const prev = () =>
    setActiveIndex((i) => (i === 0 ? total - 1 : i - 1));

  return (
    <div className="gallery-wrapper">
      {/* MAIN VIEW */}
      <div className="gallery-main">
        {activeItem.type === "image" ? (
          <Image
            src={activeItem.src}
            alt="Property media"
            fill
            className="gallery-main-img"
          />
        ) : (
          <video
            src={activeItem.src}
            controls
            className="gallery-main-video"
          />
        )}

        <button className="gallery-arrow left" onClick={prev}>
          ‹
        </button>
        <button className="gallery-arrow right" onClick={next}>
          ›
        </button>
      </div>

      {/* THUMBNAILS */}
      <div className="gallery-thumbs">
        {visibleThumbs.map((item, index) => {
          const isStack =
            index === maxThumbs - 1 && remaining > 0;

          return (
            <div
              key={index}
              className={`thumb ${
                index === activeIndex ? "active" : ""
              }`}
              onClick={() => setActiveIndex(index)}
            >
              {item.type === "image" ? (
                <Image src={item.src} alt="" fill />
              ) : (
                <div className="video-thumb">▶</div>
              )}

              {isStack && (
                <div className="thumb-overlay">
                  +{remaining}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* 🔒 Local helper */
function normalizeMedia(files: string[]): MediaItem[] {
  return files.map((src) => ({
    src,
    type: src.toLowerCase().endsWith(".mp4")
      ? "video"
      : "image",
  }));
}
