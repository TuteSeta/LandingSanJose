// app/components/noticias/NewsPortal.jsx
import fs from "node:fs/promises";
import path from "node:path";
import NewsClient from "./NewsClient";

export const dynamic = "force-static";

export default async function NewsPortal() {
  let data = { items: [], fetchedAt: null };
  try {
    const filePath = path.join(process.cwd(), "public", "news.json");
    const raw = await fs.readFile(filePath, "utf8");
    data = JSON.parse(raw);
  } catch {
    // no hacer nada, queda el default
  }

  return (
    <section
      className="relative isolate min-h-[100svh] w-full
                 bg-gradient-to-br from-[#FFFFFF] via-[#CBE9F7] to-[#E6EEF2]"
    >
      {/* velo sutil */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-white/30" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 md:py-16">
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#002B5B]">
            Noticias del Club
          </h1>
          <p className="mt-3 text-lg md:text-xl text-[#006C9E]">
            Lo último de La Liga Femenina — San José (Mendoza)
          </p>

          {data?.fetchedAt && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-[#27303F] ring-1 ring-[#E6EEF2] backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-[#00AEEF]" />
              Actualizado: {new Date(data.fetchedAt).toLocaleString()}
            </div>
          )}
        </header>

        <NewsClient items={data.items || []} />
      </div>
    </section>
  );
}
