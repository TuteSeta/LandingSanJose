'use client';

import { Mail, Phone, MapPin, Instagram, Send, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Contacto() {
  return (
    <section className="relative  w-full bg-[#0b1222] text-slate-200 overflow-hidden">
      {/* radial spotlight */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.18),rgba(34,197,94,0.12)_40%,transparent_70%)] blur-3xl" />

      {/* subtle circuit corners */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-4 top-8 h-16 w-40 rounded-xl border border-slate-800/60" />
        <div className="absolute right-6 bottom-12 h-16 w-40 rounded-xl border border-slate-800/60" />
      </div>

      {/* BACK TITLE */}
      <div className="absolute inset-x-0 top-10 flex justify-center select-none opacity-5">
        <h1 className="text-[13rem] font-extrabold tracking-widest leading-none">CONTACTO</h1>
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 py-20 md:grid-cols-2 md:px-10">
        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 text-sm shadow">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            Contacto
          </div>

          <h2 className="text-4xl font-semibold tracking-tight">Ponete en contacto</h2>
          <p className="max-w-md text-slate-400">
            ¿Querés sumarte a entrenar, jugar amistosos, o tenés dudas sobre inscripciones? Escribinos y el Club de Basket <span className="text-slate-200 font-medium">San José</span> te responde a la brevedad.
          </p>

          <div className="space-y-4">
            <ContactCard icon={<Mail className="h-5 w-5" />} title="Email" value="contacto@sanjosebasket.com" href="mailto:contacto@sanjosebasket.com" />
            <ContactCard icon={<Phone className="h-5 w-5" />} title="Teléfono" value="(261) 555-0198" href="tel:+542615550198" />
            <ContactCard icon={<MapPin className="h-5 w-5" />} title="Ubicación" value="Gimnasio San José, Mendoza, AR" href="https://maps.google.com/?q=Gimnasio+San+Jose+Mendoza" />
            <ContactCard icon={<Instagram className="h-5 w-5" />} title="Instagram" value="@sanjosebasket" href="https://instagram.com/sanjosebasket" />
          </div>

          {/* Mini horarios */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow">
            <p className="text-sm text-slate-400">Horarios de atención</p>
            <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <li className="text-slate-300">Lun–Vie</li>
              <li className="text-right text-slate-400">09:00–13:00 / 16:00–20:00</li>
              <li className="text-slate-300">Sábados</li>
              <li className="text-right text-slate-400">10:00–13:00</li>
            </ul>
          </div>
        </motion.div>

        {/* RIGHT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className=""
        >
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <Field label="Nombre y apellido">
                <input className={inputStyle} placeholder="Tu nombre" required />
              </Field>

              <Field label="Email">
                <input type="email" className={inputStyle} placeholder="tu@email.com" required />
              </Field>

              <Field label="Mensaje">
                <textarea className={`${inputStyle} min-h-[200px] resize-y`} placeholder="Contanos en qué podemos ayudarte" required />
              </Field>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-white/95 px-5 py-3 font-medium text-slate-900 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Enviar
                <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>

              <p className="text-center text-xs text-slate-500">
                Al enviar aceptás nuestra política de privacidad.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ——— Subcomponentes ——— */
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </label>
  );
}

const inputStyle =
  "w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition";

function ContactCard({ icon, title, value, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow transition hover:border-slate-700 hover:bg-slate-900/60"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-slate-800 bg-slate-900/70">
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-400">{title}</p>
          <p className="text-sm text-slate-200">{value}</p>
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
    </a>
  );
}
