"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import NavBar from "./NavBar";
import InteractiveCourt from "./InteractiveCourt";

export default function Hero() {
  // Mapeo único de ítems ⇄ secciones de la cancha (fuente de verdad)
  const items = useMemo(
    () => [
      { label: "Noticias", part: "leftKey", href: "/noticias" },
      { label: "Plantel", part: "center", href: "/plantel" },
      { label: "Historia", part: "halfCourt", href: "/historia" },
      { label: "Contacto", part: "rightKey", href: "/contacto" },
    ],
    []
  );

  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, content: "", x: 0, y: 0 });

  // Estado del carrusel/hover
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  // Intervalo del carrusel (simula hover) – pausa/reanuda
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const stepMs = 1800; // velocidad del carrusel
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % items.length);
    }, stepMs);
    return () => clearInterval(intervalRef.current);
  }, [paused, items.length]);

  // Callbacks desde NavBar
  const handleHoverStart = (index) => {
    setPaused(true);
    setActiveIndex(index);
  };
  const handleHoverEnd = () => {
    setPaused(false);
  };

  const activePart = items[activeIndex]?.part ?? null;

  return (
    <>
      {tooltip.visible && (
        <div
          className="absolute z-50 px-3 py-2 text-sm font-semibold text-white bg-[#002B5B]/90 rounded-md shadow-lg pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -120%)" }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Fondo: blanco → celeste suave */}
      <section
        className={`relative isolate overflow-hidden min-h-screen w-full text-[#27303F]
        bg-gradient-to-br from-[#FFFFFF] via-[#CBE9F7] to-[#E6EEF2]
        transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        <NavBar
          items={items}
          activeIndex={activeIndex}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
        />

        {/* Encabezado centrado + cancha debajo */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 md:pt-24 pb-12 flex flex-col items-center">
          <h1 className="text-center text-5xl md:text-7xl font-black tracking-tighter text-[#002B5B]">
            Union Deportiva San José 
          </h1>

          <p className="mt-4 max-w-prose text-center text-xl md:text-2xl text-[#006C9E] leading-relaxed">
            Pasión, formación y comunidad en la cancha.
          </p>

          {/* Cancha */}
          <div className="w-full mt-10">
            <InteractiveCourt onHover={setTooltip} activePart={activePart} />
          </div>

          {/* CTA opcional */}
          <a
            href="#plantel"
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold
                       bg-[#00AEEF] text-white shadow-sm ring-1 ring-inset ring-[#00AEEF]/20
                       hover:bg-[#008ECF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00AEEF]"
          >
            Ver plantel
          </a>
        </div>

        {/* velo decorativo */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
      </section>
    </>
  );
}
