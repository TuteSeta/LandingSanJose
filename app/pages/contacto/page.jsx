import Contacto from "../../components/contacto/contacto.jsx";
import NavBar from "../../components/hero/NavBar.jsx";
import NAV_ITEMS from "../../components/hero/navItems.js";
export default function Home() {
  return (
    <div className="min-h-dvh bg-[#F9FAFB]">
      <NavBar items={NAV_ITEMS} />
      <Contacto></Contacto>
    </div>
  );
}
