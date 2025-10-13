import { Mail, Phone, MapPin, Facebook, Instagram, ArrowUpRight } from "lucide-react";

export default function FooterContacto() {
  return (
    <footer className="relative  w-full border-t border-slate-800/70 bg-[black] text-slate-200">
      {/* glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.18),rgba(34,197,94,0.12)_40%,transparent_70%)] blur-2xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-3 md:px-10">
        {/* Brand & blurb */}
        <div>
          <h3 className="text-lg font-semibold">Club de Basket San José</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            Formación, respeto y pasión por el básquet. Sumate a nuestros entrenamientos o escribinos por consultas e inscripciones.
          </p>
        </div>

        {/* Contact quick cards */}
        <div className="space-y-3">
          <ContactItem icon={<Mail className="h-4 w-4" />} label="Email" href="mailto:ramiromartinez3596@gmail.com" value="ramiromartinez3596@gmail.com" />
          <ContactItem icon={<Phone className="h-4 w-4" />} label="Teléfono" href="https://api.whatsapp.com/send?phone=5492617114984" value="(261) 7114984" />
          <ContactItem icon={<MapPin className="h-4 w-4" />} label="Ubicación" href="https://maps.app.goo.gl/BEwfZmqRqJUWbhEv7" value="San José, Mendoza, AR" />
        </div>

        {/* Social & CTA */}
        <div className="flex flex-col items-start gap-4 md:items-end">
          <div className="flex items-center gap-3">
            <SocialLink href="https://www.facebook.com/profile.php?id=61579710961060&rdid=tJ2xxYwz3L8BlpDP#" label="Facebook del club">
              <Facebook className="h-5 w-5" />
            </SocialLink>
            <SocialLink href="https://www.instagram.com/udsjbasquet?igsh=MWg0YXhtOWI1MWFqMw==" label="Instagram del club">
              <Instagram className="h-5 w-5" />
            </SocialLink>
          </div>
        
        </div>
      </div>

      <div className="relative border-t border-slate-800/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-6 py-5 text-xs text-slate-500 md:flex-row md:px-10">
          <span>© {new Date().getFullYear()} Club de Basket San José. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}

function ContactItem({ icon, label, value, href }) {
  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-black p-3 text-sm shadow transition hover:border-slate-700 hover:bg-slate-900/60"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-slate-800 bg-black">
          {icon}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
          <p className="text-slate-200">{value}</p>
        </div>
      </div>
    </a>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-xl border border-slate-800 bg-black text-slate-300 shadow transition hover:scale-[1.03] hover:border-slate-600 hover:text-white"
    >
      {children}
    </a>
  );
}
