"use client";

import { useState } from "react";

function formatDateHuman(d) {
  const t = Date.parse(d ?? "");
  if (isNaN(t)) return d ?? "";
  return new Date(t).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function NewsCard({ item }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-[#E6EEF2]
                 bg-white/80 shadow-sm ring-1 ring-transparent transition
                 hover:-translate-y-0.5 hover:shadow-md hover:ring-[#CBE9F7] backdrop-blur"
    >
      {/* Imagen / placeholder */}
      <div className="relative">
        {item.img ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 animate-pulse rounded-t-2xl bg-[#E6EEF2]" />
            )}
            <img
              src={item.img}
              alt={item.title ?? "Noticia"}
              className={`h-48 w-full object-cover transition-opacity ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setLoaded(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-[#CBE9F7] to-[#E6EEF2]">
            <span className="text-5xl">📰</span>
          </div>
        )}

        {/* Overlay degradado sutil */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Contenido */}
      <div className="p-4">
        <a
          href={item.href}
          target="_blank"
          rel="noopener"
          className="block text-lg font-semibold leading-snug text-[#0b1020] hover:underline"
        >
          {item.title}
        </a>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {item.date && (
            <span className="rounded-full bg-[#E6EEF2] px-2.5 py-1 text-xs font-medium text-[#27303F]">
              {formatDateHuman(item.date)}
            </span>
          )}
          <span className="rounded-full bg-[#00AEEF]/10 px-2.5 py-1 text-xs font-semibold text-[#007FB6] ring-1 ring-[#00AEEF]/20">
            Fuente: La Liga Femenina
          </span>
        </div>

        {item.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm text-[#27303F]/80">
            {item.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
