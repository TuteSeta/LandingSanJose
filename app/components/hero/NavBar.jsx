"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar({
  items = [],
  interactive = false,   
  activeIndex = 0,       
  onHoverStart,
  onHoverEnd,
}) {
  const [path, setPath] = useState("/");

  useEffect(() => {
    if (typeof window !== "undefined") setPath(window.location.pathname || "/");
  }, []);

  const handleEnter = (idx) => onHoverStart?.(idx);
  const handleLeave = () => onHoverEnd?.();

  const isPathActive = (href) => {
    return path === href || path.startsWith(href + "/");
  };

  return (
    <nav
      role="navigation"
      className="sticky top-0 z-30 supports-[backdrop-filter]:bg-white/80 backdrop-blur-md border-b border-[#E6EEF2] shadow-sm"
      onMouseLeave={handleLeave}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/escudoClub.png"
            alt="Escudo Club San José"
            className="h-10 w-10 md:h-12 md:w-12 drop-shadow-sm transition-transform group-hover:scale-105"
          />
          <span className="text-xl md:text-3xl font-extrabold tracking-tight text-[#002B5B]">
            San <span className="text-[#00AEEF]">José</span>
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-4 lg:gap-6 text-base font-semibold">
          {items.map(({ label, href }, idx) => {
            const routeActive = isPathActive(href);
            const carouselActive = interactive && idx === activeIndex;
            const styledActive = interactive ? carouselActive : routeActive;

            return (
              <li key={label}>
                <Link
                  href={href}
                  aria-current={routeActive ? "page" : undefined}
                  className={[
                    "relative inline-flex items-center rounded-xl px-3 py-2",
                    "transition-transform duration-200 ease-out will-change-transform",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AEEF]",
                    styledActive
                      ? "bg-[#CBE9F7] text-[#006C9E] shadow-[0_2px_10px_rgba(0,174,239,0.15)] scale-110"
                      : "text-[#27303F] hover:text-[#006C9E] hover:bg-[#CBE9F7] hover:scale-[1.08]"
                  ].join(" ")}
                  onMouseEnter={() => handleEnter(idx)}
                  onMouseLeave={handleLeave}
                  onFocus={() => handleEnter(idx)}
                  onBlur={handleLeave}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile pills */}
      <div className="md:hidden bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/55">
        <ul
          className={[
            "mx-auto max-w-7xl px-3 py-2 flex gap-2 overflow-x-auto snap-x",
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          ].join(" ")}
        >
          {items.map(({ label, href }, idx) => {
            const routeActive = isPathActive(href);
            const carouselActive = interactive && idx === activeIndex;
            const styledActive = interactive ? carouselActive : routeActive;

            return (
              <li key={label} className="snap-start shrink-0">
                <Link
                  href={href}
                  aria-current={routeActive ? "page" : undefined}
                  className={[
                    "inline-flex items-center rounded-2xl px-4 py-2.5 text-[15px] font-semibold",
                    "transition-transform duration-200 ease-out will-change-transform",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00AEEF]",
                    styledActive
                      ? "bg-gradient-to-br from-[#CBE9F7] to-[#B5E2F8] text-[#005b87] shadow-md scale-105"
                      : "bg-white/80 text-[#0f2940] ring-1 ring-black/5 shadow-sm hover:scale-[1.04] hover:bg-white"
                  ].join(" ")}
                  onMouseEnter={() => handleEnter(idx)}
                  onMouseLeave={handleLeave}
                  onFocus={() => handleEnter(idx)}
                  onBlur={handleLeave}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
