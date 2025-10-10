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
  // normalizo claves
  const o = {};
  for (const k of Object.keys(rawIn)) o[normalizeKey(k)] = rawIn[k];

  const nombre   = pickFirst(o, ['nombre','name','jugadora','player']);
  const posicion = pickFirst(o, ['posicion','position','pos']);
  const rol      = pickFirst(o, ['rol','role','cargo']);
  const dorsal   = Number(pickFirst(o, ['dorsal','nro','numero','#']) || 0);
  const activo   = /^(true|1)$/i.test(String(pickFirst(o, ['activo','active']) || ''));

  // columna de URL directa (i.ibb.co / i.postimg.cc / etc.)
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
      <div className="pointer-events-none fixed -top-60 left-1/2 h-[100rem] w-[100rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,174,239,0.20),rgba(0,43,91,0.10)_45%,transparent_75%)] blur-3xl" />
      <div className="absolute inset-x-0 top-10 flex justify-center select-none opacity-5">
        <h1 className="text-[12rem] font-extrabold tracking-widest leading-none text-[#002B5B]">PLANTEL</h1>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-16 pb-10 md:px-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E6EEF2] bg-[#FFFFFF] px-3 py-1 text-sm shadow">
            <span className="inline-block h-2 w-2 rounded-full bg-[#00AEEF]" />
            Plantel temporada 24/25
          </div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#002B5B]">{titulo}</h2>
          <p className="mt-2 max-w-2xl text-[#27303F]">Jugadoras del Club de Basket <span className="font-medium text-[#006C9E]">San José</span>.</p>
        </motion.div>

        {loading && <p className="text-[#27303F]">Cargando plantel…</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {jugadoras.map((p, idx) => (
              <motion.div key={p.id || idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: idx * 0.04 }}>
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
    <div className="group overflow-hidden rounded-2xl border border-[#E6EEF2] bg-[#FFFFFF] shadow transition hover:border-[#006C9E] hover:bg-[#CBE9F7]">
      <div className="relative aspect-[3/4] w-full">
        {imagen_url ? (
          <Image
            src={imagen_url}
            alt={nombre || 'Jugador/a'}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
            onError={(e) => {
              const el = e.currentTarget;
              // @ts-ignore - next/image no expone style, pero funciona
              el.style.display = 'none';
              el.parentElement?.querySelector('[data-placeholder]')?.removeAttribute('hidden');
            }}
          />
        ) : null}

        <div
          data-placeholder
          hidden={Boolean(imagen_url)}
          className="absolute inset-0 grid place-items-center bg-[#CBE9F7] text-[#006C9E] text-sm"
        >
          Sin foto
        </div>

        <div className="absolute left-3 top-3 rounded-xl border border-[#E6EEF2] bg-[#F9FAFB] px-2 py-1 text-xs font-semibold text-[#27303F] backdrop-blur">
          #{Number.isFinite(dorsal) && dorsal !== 0 ? dorsal : '—'}
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold leading-tight text-[#27303F]">{nombre || '—'}</h3>
          <p className="text-xs text-[#27303F]">{posicion || '—'}</p>
          {rol && <p className="mt-1 text-xs text-[#006C9E]">{rol}</p>}
        </div>
      </div>
    </div>
  );
}
