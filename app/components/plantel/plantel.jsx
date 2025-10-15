'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

/* =============== Utils mínimos =============== */
function normalizeKey(str = '') {
  return String(str)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}
function pickFirst(o, keys) {
  for (const k of keys) {
    const v = o[k];
    if (v != null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
}
function parseGVizText(txt) {
  const start = txt.indexOf('setResponse(');
  const end = txt.lastIndexOf(');');
  if (start === -1 || end === -1) throw new Error('Formato GViz inesperado');
  return JSON.parse(txt.slice(start + 'setResponse('.length, end).trim());
}

/* =============== Normalizador de filas =============== */
function normalizeRow(rawIn) {
  const o = {};
  for (const k of Object.keys(rawIn)) o[normalizeKey(k)] = rawIn[k];

  const nombre   = pickFirst(o, ['nombre','name','jugadora','player']);
  const posicion = pickFirst(o, ['posicion','position','pos']);
  const rol      = pickFirst(o, ['rol','role','cargo']);
  const dorsal   = Number(pickFirst(o, ['dorsal','nro','numero','#']) || 0);
  const activo   = /^(true|1)$/i.test(String(pickFirst(o, ['activo','active']) || ''));

  const imagen_url = pickFirst(o, [
    'imagen_url','imagen','image','foto','photo','url','link',
    'imagenurl','imageurl','fotourl','foto_url','image_url'
  ]);

  const id = pickFirst(o, ['id','uuid','_id']) || `${nombre}-${dorsal || 'sn'}`;
  return { id, nombre, posicion, rol, dorsal, activo, imagen_url };
}

/* =============== Fetch GViz =============== */
async function fetchGViz(GVIZ_URL) {
  const r = await fetch(GVIZ_URL, { cache: 'no-store' });
  const txt = await r.text();
  if (!r.ok) throw new Error(`GViz HTTP ${r.status}`);
  const json = parseGVizText(txt);

  const rows = json.table.rows || [];
  let cols   = (json.table.cols || []).map(c => (c?.label || '').trim());

  // si no hay labels, primera fila como encabezado
  let dataRows = rows;
  if (!cols.some(Boolean) && rows.length) {
    cols = (rows[0].c || []).map(c => String(c?.f ?? c?.v ?? '').trim());
    dataRows = rows.slice(1);
  }
  const normCols = cols.map(normalizeKey);

  return dataRows.map(row => {
    const raw = {};
    row.c?.forEach((cell, i) => {
      raw[normCols[i] || `col_${i}`] = (cell?.f ?? cell?.v ?? '');
    });
    return normalizeRow(raw);
  });
}

/* =============== Componente =============== */
export default function Plantel() {
  const [jugadoras, setJugadoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const titulo = useMemo(() => 'Nuestro equipo', []);

  useEffect(() => {
    const SHEET_ID = '1OhkLm8wlDvD0wQ3Jkn31LJoDTWuYTg7y2uC78q-5GYA';
    const GID = '0';
    const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;

    (async () => {
      setLoading(true); setError('');
      try {
        const data = await fetchGViz(GVIZ_URL);
        const activos = data.filter(j => j.activo);
        setJugadoras(activos);
        if (activos[0]) console.log('Ejemplo GViz:', activos[0]);
      } catch (e) {
        console.error(e);
        setError('No se pudo cargar el plantel.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="relative w-full bg-transparent text-[#27303F] overflow-hidden">
      {/* glow sutil (oculto en mobile para evitar ruido visual) */}
      <div className="pointer-events-none fixed -top-60 left-1/2 h-[80rem] w-[80rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,174,239,0.16),rgba(0,43,91,0.08)_45%,transparent_75%)] blur-3xl hidden md:block" />
      {/* marca de agua grande, oculta en mobile */}
      <div className="absolute inset-x-0 top-10 hidden md:flex justify-center select-none opacity-5">
        <h1 className="text-[10rem] font-extrabold tracking-widest leading-none text-[#002B5B]">PLANTEL</h1>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-10 pb-8 sm:px-6 md:px-10 md:pt-16 md:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .5 }}
          className="mb-5 md:mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E6EEF2] bg-white px-2.5 py-0.5 text-xs shadow md:px-3 md:py-1 md:text-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00AEEF]" />
            Plantel temporada 24/25
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#002B5B] md:mt-3 md:text-4xl">
            {titulo}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[#27303F] md:text-base">
            Jugadoras del Club de Basket <span className="font-medium text-[#006C9E]">San José</span>.
          </p>
        </motion.div>

        {loading && <p className="text-sm md:text-base text-[#27303F]">Cargando plantel…</p>}
        {error && <p className="text-sm md:text-base text-red-500">{error}</p>}

        {!loading && !error && (
          <div
            className="
              grid
              grid-cols-2 gap-3
              sm:gap-4
              md:grid-cols-3 md:gap-6
              lg:grid-cols-4
            "
          >
            {jugadoras.map((p, idx) => (
              <motion.div
                key={p.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
              >
                <PlayerCard {...p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* =============== Card =============== */
function PlayerCard({ nombre, posicion, rol, dorsal, imagen_url }) {
  return (
    <div
      className="
        group overflow-hidden rounded-xl
        border border-[#E6EEF2] bg-white
        shadow-sm md:shadow
        transition
        hover:border-[#006C9E] hover:bg-[#CBE9F7]
      "
    >
      <div className="relative aspect-[7/10] w-full">
        {imagen_url ? (
          <Image
            src={imagen_url}
            alt={nombre || 'Jugador/a'}
            fill
            sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 18vw"
            className="
              object-cover object-center
              md:transition-transform md:duration-300 md:group-hover:scale-[1.03]
            "
            onError={(e) => {
              const el = e.currentTarget;
              // @ts-ignore
              el.style.display = 'none';
              el.parentElement?.querySelector('[data-placeholder]')?.removeAttribute('hidden');
            }}
          />
        ) : null}

        <div
          data-placeholder
          hidden={Boolean(imagen_url)}
          className="absolute inset-0 grid place-items-center bg-[#CBE9F7] text-[#006C9E] text-xs"
        >
          Sin foto
        </div>

        <div
          className="
            absolute left-2 top-2 rounded-lg
            border border-[#E6EEF2] bg-[#F9FAFB]
            px-1.5 py-0.5 text-[10px] font-semibold text-[#27303F]
            backdrop-blur
            md:left-3 md:top-3 md:px-2 md:py-1 md:text-xs
          "
        >
          #{Number.isFinite(dorsal) && dorsal !== 0 ? dorsal : '—'}
        </div>
      </div>

      <div className="flex items-start justify-between gap-2 p-3 md:gap-3 md:p-4">
        <div>
          <h3 className="text-sm md:text-base font-semibold leading-tight text-[#27303F] line-clamp-1">
            {nombre || '—'}
          </h3>
          <p className="text-[11px] md:text-xs text-[#27303F] line-clamp-1">
            {posicion || '—'}
          </p>
          {rol && (
            <p className="mt-0.5 md:mt-1 text-[11px] md:text-xs text-[#006C9E] line-clamp-1">
              {rol}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
