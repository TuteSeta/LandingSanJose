"use client";
import { useEffect, useMemo, useRef, useState } from "react";

// Componente para el contenido de texto de un hito.
const HitoContent = ({ item, goToNext }) => (
  <div className="flex flex-col items-start gap-3 sm:gap-4 h-full">
    <span
      className="inline-flex w-fit items-center px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide border"
      style={{ background: 'var(--celeste-sanjo)', color: "white", borderColor: "transparent" }}
    >
      {item.year}
    </span>
    <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white drop-shadow">
      {item.title}
    </h2>
    <p className="text-sm sm:text-base leading-relaxed text-white/90 max-w-md">
      {item.text}
    </p>
    {goToNext && (
      <div className="mt-auto pt-4">
        <button
          onClick={goToNext}
          className="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border backdrop-blur-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80"
          style={{ borderColor: "color-mix(in srgb, white 40%, transparent)", background: "color-mix(in srgb, rgba(255,255,255,0.06) 100%, transparent)", color: "white", outline: 'none' }}
        >
          Continuar
          <svg width="18" height="18" viewBox="0 0 24 24" className="transition-transform duration-200 ease-in-out group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )}
  </div>
);

// Componente para la imagen de un hito.
const HitoImage = ({ item }) => (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl aspect-video md:aspect-auto">
        <div
            className="w-full h-full bg-center bg-cover transition-transform duration-500 ease-out hover:scale-105"
            style={{ backgroundImage: `url(${item.image})` }}
            role="img"
            aria-label={item.title}
        />
    </div>
);

export default function HistoriaTimeline({
  items = [],
  accentVar = "var(--azul-sanjo)",
  // Intro
  introKicker = "NUESTRA HISTORIA",
  introHashtag = "#ELBARRIOSANTO",
  introTitle = "Club Barrio Santo",
  introSubtitle = "Seleccioná un período para explorar los hitos del club",
  // Opcional: rangos manuales. Si está vacío, se generan por décadas.
  ranges = [],
}) {
  const [active, setActive] = useState(0);
  const sectionRefs = useRef([]);
  const containerRef = useRef(null);

  const [navH, setNavH] = useState(64);
  useEffect(() => {
    const detect = () => {
      const nav = document.querySelector('nav[role="navigation"]');
      const h = nav?.offsetHeight ?? 64;
      setNavH(h);
      document.documentElement.style.setProperty("--nav-h", `${h}px`);
    };
    detect();
    const ro = new ResizeObserver(detect);
    const nav = document.querySelector('nav[role="navigation"]');
    if (nav) ro.observe(nav);
    window.addEventListener("resize", detect);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", detect);
    };
  }, []);

  const autoRanges = useMemo(() => {
    if (!items.length) return [];
    const years = items.map((i) => Number(i.year)).filter(Boolean).sort((a, b) => a - b);
    if (!years.length) return [];
    const minY = Math.floor(years[0] / 20) * 20;
    const maxY = Math.ceil(years[years.length - 1] / 20) * 20;
    const rs = [];
    for (let y = minY; y < maxY; y += 20) {
      rs.push({ label: `${y} - ${y + 19}`, from: y, to: y + 19 });
    }
    const currentYear = new Date().getFullYear();
    if (maxY > currentYear - 20) {
      rs[rs.length - 1] = { label: `${maxY - 20} - HOY`, from: maxY - 20, to: 9999 };
    }
    return rs;
  }, [items]);

  const visibleRanges = ranges.length ? ranges : autoRanges;

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = Number(visible.target.getAttribute("data-index"));
          setActive(idx);
        }
      },
      { threshold: 0.4, rootMargin: `-${navH}px 0px 0px 0px` }
    );
    sectionRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [items.length, navH]);

  const goTo = (idx) => {
    const el = sectionRefs.current[idx];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (navH + 20); // Pequeño offset
    window.scrollTo({ top, behavior: "smooth" });
  };

  const goToRange = (from, to) => {
    const idx = items.findIndex((it) => Number(it.year) >= from && Number(it.year) <= to);
    if (idx >= 0) goTo(idx);
  };

  return (
    <section ref={containerRef} className="relative w-full isolate overflow-clip" style={{ background: "var(--background)", color: "var(--content-text)" }} aria-label="Historias del club">
      <header className="relative w-full text-center" style={{ scrollMarginTop: "var(--nav-h, 64px)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(1200px 400px at 50% -10%, rgba(0,0,0,0.12), transparent 60%), linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 60%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16">
          <p className="text-xs sm:text-sm font-bold tracking-[0.15em] uppercase opacity-80">{introKicker}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">{introHashtag}</h1>
          <h2 className="mt-1 text-xl sm:text-2xl md:text-3xl font-black">{introTitle}</h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg max-w-2xl mx-auto opacity-90">{introSubtitle}</p>
          {visibleRanges.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <p className="text-xs sm:text-sm font-semibold mb-2 opacity-80">Seleccioná el período</p>
              <div className="flex flex-wrap justify-center gap-2">
                {visibleRanges.map((r, i) => (
                  <button key={i} onClick={() => goToRange(r.from, r.to)} className="px-3 py-1.5 rounded-full text-sm border transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2" style={{ background: "transparent", borderColor: "color-mix(in srgb, var(--foreground) 20%, transparent)", outline: "none" }}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ===== CONTENEDOR PRINCIPAL DE LA TIMELINE ===== */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* LÍNEA DE TIEMPO VERTICAL (solo para escritorio) */}
        <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-white/10 md:block" />

        <div aria-label="Línea de tiempo del club" className="snap-y snap-mandatory">
          {items.map((it, idx) => {
            const isEven = idx % 2 === 0;
            const isActive = idx === active;

            return (
              <article
                key={it.id ?? idx}
                ref={(el) => (sectionRefs.current[idx] = el)}
                data-index={idx}
                className="relative w-full snap-start py-12 md:py-20"
                style={{ scrollMarginTop: "var(--nav-h, 64px)" }}
              >
                  {/* Fondo de imagen para cada sección */}
                  <div className="absolute inset-0 opacity-60">
                      <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${it.image})`}} />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.8) 100%)" }} />
                  </div>

                {/* ======================================= */}
                {/* NUEVO: LAYOUT PARA MÓVIL (md:hidden)  */}
                {/* ======================================= */}
                <div className="relative grid grid-cols-[auto_1fr] gap-x-6 md:hidden">
                    {/* Columna de la línea y el punto */}
                    <div className="relative flex flex-col items-center">
                        {/* El punto */}
                         <div
                            className={`sticky top-28 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${isActive ? 'scale-125 border-4' : ''}`}
                            style={{
                                background: isActive ? accentVar : 'var(--background)',
                                borderColor: isActive ? accentVar : 'color-mix(in srgb, var(--foreground) 30%, transparent)'
                            }}
                        />
                        {/* La línea vertical */}
                        {idx < items.length -1 && <div className="mt-2 h-full w-0.5 bg-white/10" />}
                    </div>
                    {/* Columna de contenido */}
                    <div className="flex flex-col gap-6">
                        <HitoImage item={it} />
                        <HitoContent item={it} goToNext={idx < items.length - 1 ? () => goTo(idx + 1) : null} />
                    </div>
                </div>


                {/* ========================================================= */}
                {/* LAYOUT ORIGINAL PARA ESCRITORIO (hidden md:grid)      */}
                {/* ========================================================= */}
                <div className="relative mx-auto hidden max-w-5xl items-center gap-8 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-12">
                  {/* Contenido Izquierdo */}
                  <div className={`md:order-1 ${!isEven ? 'md:order-3' : ''}`}>
                    {isEven 
                      ? <HitoImage item={it} />
                      : <HitoContent item={it} goToNext={idx < items.length - 1 ? () => goTo(idx + 1) : null} />
                    }
                  </div>
                  
                  {/* Punto en la Timeline (Centro) */}
                  <div className="relative md:order-2">
                    {/* El punto */}
                    <div
                      className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${isActive ? 'scale-125 border-4' : ''}`}
                      style={{
                        background: isActive ? accentVar : 'var(--background)',
                        borderColor: isActive ? accentVar : 'color-mix(in srgb, var(--foreground) 30%, transparent)'
                      }}
                    />
                  </div>
                  
                  {/* Contenido Derecho */}
                  <div className={`md:order-3 ${!isEven ? 'md:order-1' : ''}`}>
                    {isEven 
                      ? <HitoContent item={it} goToNext={idx < items.length - 1 ? () => goTo(idx + 1) : null} />
                      : <HitoImage item={it} />
                    }
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}