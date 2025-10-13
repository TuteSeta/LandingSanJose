"use client";

import { useMemo, useState } from "react";
import NewsCard from "./NewsCard";

function normalize(s = "") {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export default function NewsClient({ items = [] }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest"); 

  const filtered = useMemo(() => {
    const nq = normalize(q);
    const list = items.filter((n) => {
      const hay = `${n.title ?? ""} ${n.excerpt ?? ""}`;
      return normalize(hay).includes(nq);
    });

    const parseDate = (d) => {
      const t = Date.parse(d ?? "");
      return isNaN(t) ? 0 : t;
    };

    return [...list].sort((a, b) => {
      if (sort === "title") {
        return (a.title ?? "").localeCompare(b.title ?? "");
      }
      if (sort === "oldest") {
        return parseDate(a.date) - parseDate(b.date);
      }
      return parseDate(b.date) - parseDate(a.date);
    });
  }, [items, q, sort]);

  return (
    <>
      {/* Controles */}
      <div
        className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center md:justify-between"
      >
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título o resumen…"
            className="w-full rounded-2xl border border-[#E6EEF2] bg-white/80 px-4 py-3
                       text-[#27303F] shadow-sm outline-none backdrop-blur
                       placeholder:text-[#6B7B8C]
                       focus:ring-2 focus:ring-[#00AEEF] focus:ring-offset-2"
          />
          <span
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#6B7B8C]"
          >
            ⌕
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-[#27303F]">Ordenar:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-[#E6EEF2] bg-white/80 px-3 py-2
                       text-[#27303F] shadow-sm outline-none backdrop-blur
                       focus:ring-2 focus:ring-[#00AEEF] focus:ring-offset-2"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="title">Título (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Grilla */}
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-[#E6EEF2] bg-white/70 p-6 text-center text-[#27303F] backdrop-blur">
          No encontramos resultados con “{q}”.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((n) => (
            <li key={n.href}>
              <NewsCard item={n} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
